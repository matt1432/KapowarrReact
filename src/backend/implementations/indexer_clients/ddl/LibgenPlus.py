from asyncio import run
from datetime import datetime

from aiohttp import ClientError
from libgencomics import LibgenException, LibgenSearch, ResultFile

from backend.base.custom_exceptions import ClientNotWorking
from backend.base.definitions import (
    BrokenClientReason,
    Constants,
    DownloadService,
    DownloadType,
    QueryResult,
    SearchQuery,
    SearchResultData,
    VolumeData,
)
from backend.base.definitions import (
    IndexerClientField as ICF,
)
from backend.base.file_extraction import extract_filename_data
from backend.base.helpers import AsyncSession
from backend.base.logging import LOGGER
from backend.implementations.indexer_client_manager import (
    BaseIndexerClient,
    IndexerClients,
)
from backend.internals.settings import Settings


def _download_sources() -> list[str]:
    download_sources = [
        DownloadService.LIBGENPLUS.value,
        DownloadService.LIBGENPLUS_TORRENT.value,
    ]

    if Settings().sv.flaresolverr_base_url:
        download_sources.append(DownloadService.ANNAS_ARCHIVE.value)

    return download_sources


@IndexerClients.register_client(
    DownloadType.DDL,
    "Libgen+",
    (ICF.TITLE, ICF.ENABLED),
    allow_multiple_instances=False,
)
class LibgenPlusIndexer(BaseIndexerClient):
    """
    Searches Libgen+ based on the ComicVine metadata of the volume. The URL of
    Libgen+ is not configurable, as it is fetched from the repository of
    Kapowarr React to make sure it's always up to date.
    """

    def __init__(self, indexer_id: int) -> None:
        super().__init__(indexer_id)
        self._url = Constants.LIBGEN_SITE_URL

        self.series_searched: set[tuple[int, float | None]] = set()

        return

    def _parse_result(
        self, file_result: ResultFile
    ) -> tuple[SearchResultData | None, set[str]]:
        resulting_libgen_series_ids: set[str] = set()
        settings = Settings().sv

        issue = file_result.issue
        filename = file_result.filename

        if not filename:
            return None, resulting_libgen_series_ids

        if not settings.include_cover_only_files:
            # we want to filter out cover only files
            if (
                file_result.get("scan_content") or ""
            ) == "cover only" or file_result.pages == 1:
                return None, resulting_libgen_series_ids

        if not settings.include_scanned_books:
            # we want to filter out physically scanned books
            if (file_result.scan_type or "") != "digital":
                return None, resulting_libgen_series_ids

        if issue is not None:
            try:
                if isinstance(issue.series.id, int):
                    resulting_libgen_series_ids.add(str(issue.series.id))
            except Exception:
                pass

        efd = extract_filename_data(filepath=filename)

        return SearchResultData(
            series=issue.series.title or "" if issue else efd["series"],
            year=issue.year if issue else efd["year"],
            volume_number=efd["volume_number"],
            special_version=efd["special_version"],
            issue_number=efd["issue_number"],
            annual=efd["annual"],
            is_image_file=efd["is_image_file"],
            is_metadata_file=efd["is_metadata_file"],
            link=f"{self._url}/file.php?md5={file_result.get('md5')}",
            display_title=filename,
            source=self._title,
            filesize=file_result.filesize,
            pages=file_result.pages or 0,
            releaser=file_result.releaser or "",
            scan_type=file_result.scan_type or "",
            resolution=file_result.resolution or "",
            dpi=file_result.dpi or "",
            extension=file_result.extension or "",
            comics_id=int(file_result.get("comics_id"))
            if file_result.get("comics_id") is not None
            else None,
            md5=file_result.get("md5"),
            web_sub_title=None,
            download_sources=_download_sources(),
            selected_source=None,
            notes=None,
        ), resulting_libgen_series_ids

    async def _fetch_results(
        self,
        query: str,
        comicvine_id: int,
        issue_number: int | float | tuple[float, float] | None,
        series_ids: list[int] | None,
    ) -> list[ResultFile]:
        from backend.implementations.comicvine import ComicVine

        file_results: list[ResultFile] = []
        settings = Settings().sv

        flaresolverr_url = (
            settings.flaresolverr_base_url + Constants.FS_API_BASE
            if settings.flaresolverr_base_url != ""
            else None
        )

        try:
            file_results = await LibgenSearch().search_comicvine_id(
                query=query,
                api_key=settings.comicvine_api_key,
                id=comicvine_id,
                issue_number=issue_number,
                libgen_series_id=series_ids,
                libgen_site_url=self._url,
                flaresolverr_url=flaresolverr_url,
                cv_cache=ComicVine().cache,
            )
        except LibgenException as e:
            LOGGER.info(e)

        return file_results

    async def search(self, query: SearchQuery) -> QueryResult:
        from backend.implementations.volumes import Volume

        results: list[SearchResultData] = []

        volume = Volume(query["volume_id"])
        volume_data = volume.get_data()

        calculated_issue_number = query["calculated_issue_number"]
        issue_number = (
            int(calculated_issue_number)
            if isinstance(calculated_issue_number, float)
            and calculated_issue_number.is_integer()
            else calculated_issue_number
        )

        file_results = await self._fetch_results(
            query["query"], volume_data.comicvine_id, issue_number, None
        )

        resulting_libgen_series_ids: set[str] = set()

        for file_result in file_results:
            parsed_result, new_series_ids = self._parse_result(file_result)
            resulting_libgen_series_ids.update(new_series_ids)

            if parsed_result is not None:
                results.append(parsed_result)

        if (
            not volume_data.libgen_series_id
            and len(resulting_libgen_series_ids) != 0
        ):
            volume.update(
                {
                    "libgen_series_id": ",".join(resulting_libgen_series_ids),
                }
            )
            volume_data = volume.get_data()

        # Searching directly based on the Libgen+ series only needs to happen
        # once per volume/issue
        search_key = (query["volume_id"], calculated_issue_number)
        if (
            volume_data.libgen_series_id
            and search_key not in self.series_searched
        ):
            self.series_searched.add(search_key)
            series_ids = list(map(int, volume_data.libgen_series_id.split(",")))
            file_results = await self._fetch_results(
                query["query"],
                volume_data.comicvine_id,
                issue_number,
                series_ids,
            )

            for file_result in file_results:
                parsed_result, _ = self._parse_result(file_result)

                if parsed_result is not None:
                    results.append(parsed_result)

        return QueryResult(results, next_page_available=False)

    def get_file_result(
        self, libgen_file_url: str, volume_data: VolumeData
    ) -> list[SearchResultData]:
        """Get the search result of a specific Libgen+ file.

        Args:
            libgen_file_url (str): The URL to the file on Libgen+.
            volume_data (VolumeData): The data of the volume that the file is
                for.

        Returns:
            List[SearchResultData]: The search result of the file, or an empty
                list if the file wasn't found.
        """
        results: list[SearchResultData] = []

        file_id = int(libgen_file_url.split("file.php?id=")[-1])
        file_result = ResultFile(id=file_id, libgen_site_url=self._url)

        filename = file_result.filename

        if filename:
            efd = extract_filename_data(filepath=filename)

            results.append(
                SearchResultData(
                    series=volume_data.title,
                    year=volume_data.year,
                    volume_number=efd["volume_number"],
                    special_version=efd["special_version"],
                    issue_number=efd["issue_number"],
                    annual=efd["annual"],
                    is_image_file=efd["is_image_file"],
                    is_metadata_file=efd["is_metadata_file"],
                    link=f"{self._url}/file.php?md5={file_result.get('md5')}",
                    display_title=filename,
                    source=self._title,
                    filesize=file_result.filesize,
                    pages=file_result.pages or 0,
                    releaser=file_result.releaser or "",
                    scan_type=file_result.scan_type or "",
                    resolution=file_result.resolution or "",
                    dpi=file_result.dpi or "",
                    extension=file_result.extension or "",
                    comics_id=int(file_result.get("comics_id"))
                    if file_result.get("comics_id") is not None
                    else None,
                    md5=file_result.get("md5"),
                    web_sub_title=None,
                    download_sources=_download_sources(),
                    selected_source=None,
                    notes=None,
                )
            )
        return results

    async def discover(self, last_check: datetime) -> list[SearchResultData]:
        # Libgen+ is searched based on metadata, so there is no feed of new
        # releases to discover
        return []

    async def shutdown(self) -> None:
        return

    @classmethod
    async def __test(cls) -> None:
        async with AsyncSession() as session:
            try:
                html = await session.get_text(Constants.LIBGEN_SITE_URL)
                if "libgen" not in html.lower():
                    raise ClientNotWorking(
                        BrokenClientReason.NOT_CLIENT_INSTANCE
                    )

            except ClientError:
                raise ClientNotWorking(BrokenClientReason.CONNECTION_ERROR)

        return

    @classmethod
    def test(cls, url: str) -> None:
        run(cls.__test())
        return
