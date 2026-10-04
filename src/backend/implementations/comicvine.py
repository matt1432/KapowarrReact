"""
Search for volumes/issues and fetch metadata for them on ComicVine
"""

from asyncio import gather, run, sleep
from collections.abc import AsyncGenerator, Iterable, Iterator, Sequence
from contextlib import contextmanager
from contextvars import ContextVar
from datetime import UTC, date, datetime, timedelta
from os.path import dirname, join
from pathlib import Path
from re import IGNORECASE, compile
from threading import Lock
from typing import Any
from urllib.parse import parse_qs, urlsplit

from bs4 import BeautifulSoup, Tag
from pydantic import TypeAdapter, ValidationError
from pyrate_limiter import Duration, Limiter, Rate
from simyan.cache.schemas import CacheData
from simyan.comicvine import (
    AuthenticationError,
    BasicIssue,
    BasicVolume,
    Comicvine,
    ComicvineResource,
    Issue,
    ServiceError,
    SQLiteCache,
    Volume,
)

from backend.base.custom_exceptions import (
    InvalidKeyValue,
    MetadataSourceRateLimitReached,
    VolumeNotMatched,
)
from backend.base.definitions import (
    Constants,
    DateType,
    FilenameData,
    IssueMetadata,
    SpecialVersion,
    StatusType,
    VolumeData,
    VolumeMetadata,
)
from backend.base.file_extraction import (
    extract_issue_number,
    extract_volume_number,
    volume_regex,
)
from backend.base.files import folder_path
from backend.base.helpers import (
    AsyncSession,
    batched,
    first_of_range,
    force_range,
    normalise_string,
    to_number_cv_id,
    to_string_cv_id,
)
from backend.base.logging import LOGGER
from backend.implementations.matching import (
    select_best_volume_result_for_file,
)
from backend.internals.db import DBConnection, get_db
from backend.internals.server import Server
from backend.internals.settings import Settings
from backend.internals.status import StatusHandlers

preceding_volume_regex = compile(
    r"preceded by (?:<a[^>]*>)?(.*?)" + volume_regex.pattern, IGNORECASE
)
continuing_volume_regex = compile(
    r"continued in (?:<a[^>]*>)?(.*?)" + volume_regex.pattern, IGNORECASE
)
translation_regex = compile(
    r"^<p>\s*\w+(?<!English) publication(\.?</p>$|,\s| \(in the \w+(?<!English) language\)|, translates )|"
    + r"^<p>\s*published by the \w+(?<!English) wing of|"
    + r"^<p>\s*\w+(?<!English) translations? of|"
    + r".*from \w+(?<!English)\.?</p>$|"
    + r"^<p>\s*publishes in \w+(?<!English)|"
    + r"^<p>\s*\w+(?<!English) language|"
    + r"^<p>\s*\w+(?<!English) edition of|"
    + r"^<p>\s*\w+(?<!English) reprint of|"
    + r"^<p>\s*\w+(?<!English) trade collection of|"
    + r"^<p>\s*Series of \w+(?<!English) collections\.?</p>$|"
    + r".*reprints\.?</p>$",
    IGNORECASE,
)
CV_SEARCH_EXPIRY = timedelta(days=14)
CV_RESOURCE_RATE_LIMIT = 200

headers = {"h2", "h3", "h4", "h5", "h6"}
lists = {"ul", "ol"}


def _clean_description(description: str, short: bool = False) -> str:
    """Reduce the size of the volume/issue description (written in html) to only
    essential information. Removes images, lists (e.g. of authors), and fixes
    links that have a relative URL.

    Args:
        description (str): The description to clean.
        short (bool, optional): Only remove images and fix links.
            Defaults to False.

    Returns:
        str: The cleaned description.
    """
    if not description:
        return description

    soup = BeautifulSoup(description, "html.parser")

    # Remove images
    for el in soup.find_all(["figure", "img"]):
        el.decompose()

    # Remove practically empty paragraphs
    for el in soup.find_all(["p"]):
        if not el.text.lstrip(".").strip():
            el.decompose()

    if not short:
        # Remove everything after the first title with list
        removed_elements = []
        for el in soup:
            if not isinstance(el, Tag):
                continue

            elif el.name is None:
                continue

            elif removed_elements or el.name in headers:
                removed_elements.append(el)

            elif el.name in lists:
                removed_elements.append(el)
                prev_sib = el.previous_sibling
                if prev_sib is not None and prev_sib.text.endswith(":"):
                    removed_elements.append(prev_sib)

            elif el.name == "p":
                children = list(getattr(el, "children", []))
                if 1 <= len(children) <= 2 and children[0].name in (
                    "b",
                    "i",
                    "strong",
                ):
                    removed_elements.append(el)

        for el in removed_elements:
            if isinstance(el, Tag):
                el.decompose()

    # Fix links
    for link in soup.select("a"):
        link.attrs = {
            k: v for k, v in link.attrs.items() if not k.startswith("data-")
        }
        link["target"] = "_blank"
        href: str = first_of_range(link.attrs.get("href", ""))
        href = href.lstrip(".").lstrip("/")
        link["href"] = href
        if href and not href.startswith("http"):
            link["href"] = Constants.CV_SITE_URL + "/" + href

    result = str(soup)
    return result


class CVRateLimiter:
    """Rate limiter for the CV API, used instead of the one of simyan. CV
    allows 200 requests per resource per hour, while simyan counts the
    requests to all resources together. Also reports a status when the limit
    is reached, instead of silently waiting until requests are allowed again.
    """

    def __init__(self) -> None:
        self.__velocity_limiter = Limiter(Rate(1, Duration.SECOND))
        self.__resource_limiters: dict[str, Limiter] = {}
        self.__lock = Lock()
        self.__stop_on_limit: ContextVar[bool] = ContextVar(
            "cv_stop_on_limit", default=False
        )
        return

    @contextmanager
    def stop_on_limit(self) -> Iterator[None]:
        """Inside this context, raise `MetadataSourceRateLimitReached` when
        the rate limit is reached, instead of waiting until requests are
        allowed again.
        """
        token = self.__stop_on_limit.set(True)
        try:
            yield
        finally:
            self.__stop_on_limit.reset(token)
        return

    @staticmethod
    def __set_status(resource: str, limit_reached: bool) -> None:
        def _set_status() -> None:
            if limit_reached:
                StatusHandlers().report(StatusType.CV_RATE_LIMIT, resource)
            else:
                StatusHandlers().clear(StatusType.CV_RATE_LIMIT, resource)

        # Use a separate thread (and thus DB connection) so that the DB
        # change is committed immediately, instead of holding a write
        # transaction open on the connection of the caller while waiting.
        thread = Server().get_db_thread(
            target=_set_status, name="CVRateLimitStatus"
        )
        thread.start()
        thread.join()
        return

    def try_acquire(self, name: str) -> bool:
        with self.__lock:
            if name not in self.__resource_limiters:
                self.__resource_limiters[name] = Limiter(
                    Rate(CV_RESOURCE_RATE_LIMIT, Duration.HOUR)
                )
            resource_limiter = self.__resource_limiters[name]

        if resource_limiter.try_acquire(name, blocking=False):
            if StatusHandlers().problem_reported(
                StatusType.CV_RATE_LIMIT, name
            ):
                self.__set_status(name, False)

        elif self.__stop_on_limit.get():
            LOGGER.warning(
                "ComicVine rate limit reached for '%s', stopping current action",
                name,
            )
            self.__set_status(name, True)
            raise MetadataSourceRateLimitReached(name)

        else:
            LOGGER.warning(
                "ComicVine rate limit reached for '%s', waiting until requests "
                "are allowed again",
                name,
            )
            self.__set_status(name, True)
            resource_limiter.try_acquire(name)
            self.__set_status(name, False)
            LOGGER.info("ComicVine requests allowed again for '%s'", name)

        self.__velocity_limiter.try_acquire(name)
        return True


CV_RATE_LIMITER = CVRateLimiter()


class CVSession(Comicvine):
    """Simyan session that turns an error response without an "error" field
    (e.g. a 502 from CV) into a `ServiceError`, instead of simyan raising a
    `KeyError` while building the error message."""

    def _perform_get_request(
        self, endpoint: str, params: dict[str, str] | None = None
    ) -> dict[str, Any]:
        try:
            return super()._perform_get_request(
                endpoint=endpoint, params=params
            )
        except KeyError as err:
            raise ServiceError(
                f"Unexpected error response from CV for '{endpoint}'"
            ) from err


class CVCache(SQLiteCache):
    """ComicVine response cache. Entries never expire, except for search
    results, and are only removed on request (or when the refresh detects
    that the issue count of a volume changed)."""

    def __init__(self, path: Path) -> None:
        super().__init__(path=path, expiry=None)
        return

    @staticmethod
    def __split_key(key: str) -> tuple[str, dict[str, list[str]]]:
        split_key = urlsplit(key)
        return split_key.path, parse_qs(split_key.query)

    def select(self, url: str) -> CacheData | None:
        if self.__split_key(url)[0].endswith("/search/"):
            # Search results should keep showing newly added volumes
            query = """
            SELECT url, response, created_at
            FROM queries
            WHERE url = ? AND created_at > ?;
            """
            expiry = datetime.now(tz=UTC) - CV_SEARCH_EXPIRY
            return self._select(query=query, params=(url, expiry.isoformat()))
        return super().select(url)

    def cleanup(self) -> None:
        with self._connect() as conn:
            conn.execute(
                """
                DELETE FROM queries
                WHERE url LIKE ? AND created_at < ?;
                """,
                (
                    "%/search/%",
                    (datetime.now(tz=UTC) - CV_SEARCH_EXPIRY).isoformat(),
                ),
            )
        return

    def remove_entries(
        self,
        item_path: str | None,
        list_path: str,
        filter_field: str,
        cv_id: int,
    ) -> None:
        """Remove cached responses that contain data about a specific item.

        Args:
            item_path (str | None): The path prefix of the endpoint that
                returns the single item (e.g. "/volume/4050-"). `cv_id` is
                appended to it. `None` to not remove such an entry.

            list_path (str): The path of the endpoint that returns a list of
                items (e.g. "/volumes/").

            filter_field (str): The field in the filter of the list endpoint
                that `cv_id` should be matched against (e.g. "id").

            cv_id (int): The CV ID to match against `filter_field`.
        """
        to_delete: list[str] = []
        with self._connect() as conn:
            rows = conn.execute("SELECT url FROM queries;").fetchall()

            for row in rows:
                key: str = row["url"]
                path, params = self.__split_key(key)

                if item_path is not None and path.endswith(
                    f"{item_path}{cv_id}/"
                ):
                    to_delete.append(key)
                    continue

                if not path.endswith(list_path):
                    continue

                filter_ids: set[str] = set()
                for filter_value in params.get("filter", []):
                    for part in filter_value.split(","):
                        field, _, values = part.partition(":")
                        if field == filter_field:
                            filter_ids.update(values.split("|"))

                if str(cv_id) not in filter_ids:
                    continue

                to_delete.append(key)

            conn.executemany(
                "DELETE FROM queries WHERE url = ?;",
                ((key,) for key in to_delete),
            )

        LOGGER.debug("Removed CV cache entries: %s", to_delete)
        return


class ComicVine:
    def __init__(self, comicvine_api_key: str | None = None) -> None:
        """Start interacting with ComicVine.

        Args:
            comicvine_api_key (Union[str, None], optional): Instead of using the
                CV API key set in the settings, use the supplied one.
                Defaults to None.

        Raises:
            InvalidKeyValue: No ComicVine API key is set in the settings
                and no key is given.
        """
        settings = Settings().get_settings()

        self.date_type = settings.date_type.value
        api_key = comicvine_api_key or settings.comicvine_api_key
        if not api_key:
            raise InvalidKeyValue("comicvine_api_key", api_key)

        # Place the cache db at the same place as the Kapowarr db
        cache_file_location = join(
            dirname(DBConnection.default_file)
            or folder_path(*Constants.DB_FOLDER),
            Constants.CV_CACHE_NAME,
        )

        self.cache = CVCache(path=Path(cache_file_location))
        self.ssn = CVSession(
            api_key=api_key,
            cache=self.cache,
            limiter=CV_RATE_LIMITER,  # type: ignore
        )
        return

    def remove_volume_from_cache(self, cv_id: int) -> None:
        """Remove the cached responses containing the metadata of a volume.

        Args:
            cv_id (int): The CV ID of the volume.
        """
        self.cache.remove_entries("/volume/4050-", "/volumes/", "id", cv_id)
        return

    def remove_volume_issues_from_cache(self, cv_id: int) -> None:
        """Remove the cached responses containing the issues of a volume.

        Args:
            cv_id (int): The CV ID of the volume.
        """
        self.cache.remove_entries(None, "/issues/", "volume", cv_id)
        return

    def __determine_volume_number(
        self, volume_data: Volume | BasicVolume
    ) -> int:
        title = normalise_string(volume_data.name or "")

        volume_number = None
        volume_result = volume_regex.search(volume_data.summary or "")
        if volume_result:
            volume_number = force_range(
                extract_volume_number(volume_result.group(1))
            )[0]

        if volume_number is None:
            prec_volume_result = preceding_volume_regex.search(
                volume_data.description or ""
            )
            if prec_volume_result and (
                not prec_volume_result.group(1)
                or normalise_string(prec_volume_result.group(1)) == title
            ):
                volume_number = force_range(
                    extract_volume_number(prec_volume_result.group(2))
                )[0]
                if volume_number is not None:
                    volume_number += 1

        if volume_number is None:
            continuing_volume_result = continuing_volume_regex.search(
                volume_data.description or ""
            )
            if continuing_volume_result and (
                not continuing_volume_result.group(1)
                or normalise_string(continuing_volume_result.group(1)) == title
            ):
                volume_number = force_range(
                    extract_volume_number(continuing_volume_result.group(2))
                )[0]
                if volume_number is not None:
                    volume_number -= 1

        if volume_number is None:
            volume_number = 1

        return volume_number

    def __format_volume_output(
        self, volume_data: Volume | BasicVolume
    ) -> VolumeMetadata:
        """Format the API output containing the metadata of a volume.

        Args:
            volume_data (Dict[str, Any]): The API output.

        Returns:
            VolumeMetadata: The formatted data.
        """
        from backend.implementations.naming import generate_volume_folder_name

        title = normalise_string(volume_data.name or "")
        publisher = (
            volume_data.publisher.name if volume_data.publisher else None
        )
        site_url = str(volume_data.site_url)

        volume_number = self.__determine_volume_number(volume_data)

        description = _clean_description(volume_data.description or "")

        # Determine translation value
        translated = translation_regex.match(description or "") is not None

        result = VolumeMetadata(
            comicvine_id=volume_data.id,
            title=title,
            year=volume_data.start_year,
            volume_number=volume_number,
            cover_link=str(volume_data.image.small_url),
            cover=None,
            description=description,
            site_url=site_url,
            aliases=[
                a.strip()
                for a in (volume_data.aliases or "").split("\r\n")
                if a
            ],
            publisher=publisher,
            issue_count=volume_data.issue_count,
            translated=translated,
            already_added=None,  # Only used when searching
            issues=None,  # Only used for certain fetches
            folder_name=generate_volume_folder_name(
                volume_data=VolumeData(
                    id=-1,
                    comicvine_id=volume_data.id,
                    libgen_series_id=None,
                    marvel_id=None,
                    title=title,
                    alt_title=None,
                    year=volume_data.start_year or 0,
                    publisher=publisher or "",
                    volume_number=1,
                    description=description,
                    site_url=site_url,
                    monitored=False,
                    monitor_new_issues=False,
                    root_folder=1,
                    folder="",
                    custom_folder=False,
                    special_version=SpecialVersion.NORMAL,
                    special_version_locked=False,
                    last_cv_fetch=0,
                )
            ),
        )

        return result

    def __format_issue_output(
        self, issue_data: Issue | BasicIssue
    ) -> IssueMetadata:
        """Format the API output containing the metadata of the issue.

        Args:
            issue_data (Dict[str, Any]): The API output.

        Returns:
            IssueMetadata: The formatted data.
        """
        calculated_issue_number = force_range(
            extract_issue_number(issue_data.number or "0")
        )[0]
        if calculated_issue_number is None:
            calculated_issue_number = 0.0

        issue_date: date | None = None

        if self.date_type == DateType.COVER_DATE:
            issue_date = issue_data.cover_date
        elif self.date_type == DateType.STORE_DATE:
            issue_date = issue_data.store_date
        elif self.date_type == DateType.OLDEST_DATE:
            dates: list[date] = [
                idate
                for idate in [issue_data.cover_date, issue_data.store_date]
                if idate is not None
            ]
            if len(dates) != 0:
                issue_date = min(dates)

        result = IssueMetadata(
            comicvine_id=issue_data.id,
            volume_id=issue_data.volume.id,
            issue_number=(issue_data.number or "0").replace("/", "-").strip(),
            calculated_issue_number=calculated_issue_number,
            title=normalise_string(issue_data.name or "") or None,
            date=issue_date,
            description=_clean_description(
                issue_data.description or "", short=True
            ),
        )
        return result

    def __format_search_output(
        self, search_results: list[BasicVolume]
    ) -> list[VolumeMetadata]:
        """Format the API output containing volume search results.

        Args:
            search_results (List[Dict[str, Any]]): The unformatted search
            results.

        Returns:
            List[VolumeMetadata]: The formatted data.
        """
        cursor = get_db()

        formatted_results = [
            self.__format_volume_output(r) for r in search_results
        ]

        # Mark entries that are already added
        volume_ids: dict[int, int] = dict(
            cursor.execute(
                f"""
                    SELECT comicvine_id, id
                    FROM volumes
                    WHERE comicvine_id IN ({",".join("?" for _ in formatted_results)})
                    LIMIT 50;
                """,
                tuple(r["comicvine_id"] for r in formatted_results),
            )
        )

        for r in formatted_results:
            r["already_added"] = volume_ids.get(r["comicvine_id"])

        LOGGER.debug(
            "Searching for volumes with query result: %s", formatted_results
        )
        return formatted_results

    async def __sleep_iter[T](
        self, iterable: Iterable[T], batch_size: int
    ) -> AsyncGenerator[T]:
        """Iterate over the given iterable, but sleep in between. The duration
        is based on how large the batch is that each iteration is yielded. Acts
        as a cooldown between batches of requests to the API.

        Args:
            iterable (Iterable[T]): The batches to iterate over and yield.
            batch_size (int): The size of each batch.

        Yields:
            AsyncGenerator[T, None]: The batch, with a sleep done before if
                required.
        """
        batch_brake_time = Constants.CV_BRAKE_TIME * batch_size
        for index, batch in enumerate(iterable):
            if index:
                LOGGER.debug(
                    "Waiting %ss to keep the CV rate limit happy",
                    batch_brake_time,
                )
                await sleep(batch_brake_time)

            yield batch
        return

    def __fetch_list[T](
        self, endpoint: str, model: type[T], filter: str
    ) -> list[T]:
        """Fetch all pages of a list endpoint. Unlike the list functions of
        simyan, this stops after the last page instead of requesting pages
        until an empty one is returned, which wastes a request per call.

        Args:
            endpoint (str): The endpoint, e.g. "/volumes".
            model (type[T]): The model to parse the results into.
            filter (str): The value of the filter parameter.

        Raises:
            ServiceError: The request failed or the response is invalid.
            AuthenticationError: The API key is invalid.

        Returns:
            list[T]: The results of all pages.
        """
        page_size = 100
        offset = 0
        results: list[dict[str, Any]] = []
        while True:
            # Same params as simyan uses, so that the cache keys match
            response = self.ssn._get_request(
                endpoint=endpoint,
                params={
                    "filter": filter,
                    "limit": str(page_size),
                    "offset": str(offset),
                },
            )
            page = response.get("results") or []
            results.extend(page)
            offset += page_size

            if len(page) < page_size or offset >= response.get(
                "number_of_total_results", 0
            ):
                break

        try:
            return TypeAdapter(list[model]).validate_python(results)
        except ValidationError as err:
            raise ServiceError(err) from err

    def cache_volume(self, cv_id: int) -> bool:
        """Fetch the volume through this session, so that the request goes
        through the rate limiter of Kapowarr and the response gets cached.
        Other simyan sessions using the same cache (e.g. the one of
        libgencomics) then get the volume from the cache instead of making
        a request themselves.

        Args:
            cv_id (int): The CV ID of the volume.

        Returns:
            bool: Whether the volume is now in the cache.
        """
        try:
            self.ssn.get_volume(volume_id=cv_id)
        except (ServiceError, AuthenticationError) as e:
            LOGGER.info("Failed to fetch volume %s from CV: %s", cv_id, e)
            return False
        return True

    def test_key(self) -> bool:
        """Test if the API key works.

        Returns:
            bool: Whether the key works.
        """

        async def _test_key() -> bool:
            try:
                # Simply make a call to any endpoint to check. This endpoint
                # isn't used by Kapowarr so by using it now we don't
                # unnecessarily get closer to the rate limit of
                # important endpoints.
                self.ssn.get_publisher(publisher_id=31)

            except (ServiceError, AuthenticationError):
                return False

            return True

        return run(_test_key())

    async def fetch_volume(self, cv_id: str | int) -> VolumeMetadata:
        """Get the metadata of a volume, including its issues.

        Args:
            cv_id (Union[str, int]): The CV ID of the volume.

        Raises:
            MetadataSourceRateLimitReached: The rate limit is reached.
            InvalidKeyValue: The API key is not valid.
            VolumeNotMatched: Couldn't convert string CV ID to number.
            VolumeNotMatched: The ID doesn't map to any volume.

        Returns:
            VolumeMetadata: The metadata of the volume, including issues.
        """
        try:
            cv_id = to_number_cv_id((cv_id,))[0]
        except ValueError:
            raise VolumeNotMatched

        LOGGER.debug(f"Fetching volume data for {cv_id}")

        try:
            result = self.ssn.get_volume(volume_id=cv_id)

            volume_info = self.__format_volume_output(result)

            volume_info["issues"] = await self.fetch_issues((cv_id,))

            LOGGER.debug("Fetching volume data result: %s", volume_info)
            async with AsyncSession() as session:
                volume_info["cover"] = (
                    await session.get_content(
                        volume_info["cover_link"], quiet_fail=True
                    )
                    or None
                )
            return volume_info
        except (ServiceError, AuthenticationError):
            StatusHandlers().report(StatusType.CV_RATE_LIMIT, "fetch_volume")
            raise MetadataSourceRateLimitReached

    async def fetch_volumes(
        self, cv_ids: Sequence[str | int]
    ) -> list[VolumeMetadata]:
        """Get the metadata of the volumes, without their issues.

        Args:
            cv_ids (Sequence[Union[str, int]]): The CV IDs of the volumes.

        Raises:
            InvalidKeyValue: The API key is not valid.
            VolumeNotMatched: Couldn't convert string CV ID to number.

        Returns:
            List[VolumeMetadata]: The metadata of the volumes, without issues.
                The list of volumes could be incomplete if the rate limit was
                reached or if an ID couldn't be found.
        """
        try:
            formatted_cv_ids = to_string_cv_id(cv_ids)
        except ValueError:
            raise VolumeNotMatched

        LOGGER.debug(f"Fetching volume data for {formatted_cv_ids}")

        # Each request to CV can return 100 volumes. Make 10 requests at the
        # same time (one batch). Wait/cooldown in between batches. Spending time
        # fetching covers immediately after each batch increases cooldown.
        volume_infos = []
        async with AsyncSession() as session:
            async for request_batch in self.__sleep_iter(
                batched(formatted_cv_ids, 1000), 10
            ):
                try:
                    responses = [
                        self.__fetch_list(
                            "/volumes",
                            BasicVolume,
                            f"id:{'|'.join(id_batch)}",
                        )
                        for id_batch in batched(request_batch, 100)
                    ]
                    StatusHandlers().clear(
                        StatusType.CV_RATE_LIMIT, "fetch_issues"
                    )
                except (ServiceError, AuthenticationError):
                    StatusHandlers().report(
                        StatusType.CV_RATE_LIMIT, "fetch_issues"
                    )
                    raise MetadataSourceRateLimitReached

                # Format volume responses and prep cover requests
                batch_volumes: list[VolumeMetadata] = [
                    self.__format_volume_output(result)
                    for batch in responses
                    for result in batch
                ]
                cover_map: dict[int, Any] = {
                    volume["comicvine_id"]: session.get_content(
                        volume["cover_link"], quiet_fail=True
                    )
                    for volume in batch_volumes
                }

                # Fetch covers and add them to the volume info
                cover_responses = dict(
                    zip(cover_map.keys(), await gather(*cover_map.values()))
                )
                for volume in batch_volumes:
                    volume["cover"] = (
                        cover_responses.get(volume["comicvine_id"]) or None
                    )

                volume_infos.extend(batch_volumes)

        return volume_infos

    async def fetch_issues(
        self, cv_ids: Sequence[str | int]
    ) -> list[IssueMetadata]:
        """Get the metadata of the issues of volumes.

        Args:
            cv_ids (Sequence[Union[str, int]]): The CV IDs of the volumes.

        Raises:
            InvalidKeyValue: The API key is not valid.
            VolumeNotMatched: Couldn't convert string CV ID to number.

        Returns:
            List[IssueMetadata]: The metadata of all the issues inside the
                volumes. The list of issues could be incomplete if the rate
                limit was reached or if an ID couldn't be found.
        """
        try:
            formatted_cv_ids = to_string_cv_id(cv_ids)
        except ValueError:
            raise VolumeNotMatched

        LOGGER.debug(f"Fetching issue data for volumes {formatted_cv_ids}")

        issue_infos = []
        for id_batch in batched(formatted_cv_ids, 50):
            try:
                results = self.__fetch_list(
                    "/issues", BasicIssue, f"volume:{'|'.join(id_batch)}"
                )

            except (ServiceError, AuthenticationError):
                break

            issue_infos.extend([self.__format_issue_output(r) for r in results])

        unique = []
        seen = set()

        for item in issue_infos:
            if item["comicvine_id"] not in seen:
                seen.add(item["comicvine_id"])
                unique.append(item)

        return unique

    async def search_volumes(
        self,
        query: str,
        allow_rate_limit_reached: bool = False,
    ) -> list[VolumeMetadata]:
        """Search for volumes.

        Args:
            query (str): The query to use when searching.
            allow_rate_limit_reached (bool, optional): Instead of a
                MetadataSourceRateLimitReached exception being thrown, return an
                empty list.
                Defaults to False.

        Raises:
            MetadataSourceRateLimitReached: The rate limit is reached, and
                `allow_rate_limit_reached` is `False`.
            InvalidKeyValue: The API key is not valid.

        Returns:
            List[VolumeMetadata]: The search results.
        """
        LOGGER.debug(f"Searching for volumes with the query {query}")

        try:
            if query.startswith(("4050-", "cv:")):
                try:
                    return [
                        await self.fetch_volume(to_number_cv_id((query,))[0])
                    ]

                except ValueError:
                    return []

            else:
                results: list = self.ssn.search(
                    query=query,
                    resource=ComicvineResource.VOLUME,
                    max_results=50,
                )
            StatusHandlers().clear(StatusType.CV_RATE_LIMIT, "search_volumes")

        except (ServiceError, AuthenticationError, VolumeNotMatched):
            return []

        except MetadataSourceRateLimitReached:
            StatusHandlers().report(StatusType.CV_RATE_LIMIT, "search_volumes")
            if allow_rate_limit_reached:
                return []
            raise

        if not results or results == [[]]:
            return []

        return self.__format_search_output(results)

    async def filenames_to_cvs(
        self,
        file_groups: dict[int, dict[str, FilenameData]],
        only_english: bool,
    ) -> dict[int, dict[str, Any]]:
        """Match groups of filenames to CV volumes.

        Args:
            file_groups (Dict[int, Dict[str, FilenameData]]): The file groups.
                Is a mapping from group number to a mapping of filename to
                filename data for all files in that group.
            only_english (bool): Only match to english volumes.

        Raises:
            InvalidKeyValue: The API key is not valid.

        Returns:
            Dict[int, Dict[str, Any]]: A mapping from the group number to its CV
                match.
        """
        # All files in a group share a series title. Searching is done by series
        # title, so search for every title/group instead of for every file.
        titles_to_groups: dict[str, list[int]] = {}
        for group_numbers, file_group in file_groups.items():
            series_name = next(iter(file_group.values()))["series"].lower()
            titles_to_groups.setdefault(series_name, []).append(group_numbers)

        # Search for each title in batches
        titles_to_results: dict[str, list[VolumeMetadata]] = {}
        async for title_batch in self.__sleep_iter(
            batched(list(titles_to_groups), 10), 10
        ):
            titles_to_results.update(
                dict(
                    zip(
                        title_batch,
                        await gather(
                            *(
                                self.search_volumes(
                                    title, allow_rate_limit_reached=True
                                )
                                for title in title_batch
                            )
                        ),
                    )
                )
            )

        matches: dict[int, dict[str, Any]] = {}
        for title, group_numbers in titles_to_groups.items():
            for group_number in group_numbers:
                result = select_best_volume_result_for_file(
                    file_groups[group_number],
                    titles_to_results[title],
                    only_english=only_english,
                )

                if result is None:
                    matches[group_number] = {
                        "id": None,
                        "title": None,
                        "issue_count": None,
                        "link": None,
                    }

                else:
                    matches[group_number] = {
                        "id": result["comicvine_id"],
                        "title": f"{result['title']} ({result['year']})",
                        "issue_count": result["issue_count"],
                        "link": result["site_url"],
                    }

        return matches
