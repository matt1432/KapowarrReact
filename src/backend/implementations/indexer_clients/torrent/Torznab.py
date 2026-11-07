from datetime import datetime
from html import unescape
from typing import Any
from urllib.parse import unquote
from xml.etree import ElementTree

from requests import RequestException

from backend.base.custom_exceptions import ClientNotWorking, CredentialInvalid
from backend.base.definitions import (
    BrokenClientReason,
    DownloadType,
    QueryResult,
    SearchQuery,
    SearchResultData,
)
from backend.base.definitions import (
    IndexerClientField as ICF,
)
from backend.base.file_extraction import extract_filename_data
from backend.base.helpers import AsyncSession, Session, build_magnet_link
from backend.implementations.indexer_client_manager import (
    BaseIndexerClient,
    IndexerClients,
)


@IndexerClients.register_client(
    DownloadType.TORRENT,
    "Torznab",
    (
        ICF.TITLE,
        ICF.ENABLED,
        ICF.URL,
        ICF.API_PATH,
        ICF.API_KEY,
        ICF.CATEGORIES,
    ),
    allow_multiple_instances=True,
)
class TorznabIndexer(BaseIndexerClient):
    def __init__(self, indexer_id: int) -> None:
        super().__init__(indexer_id)

        self.session: AsyncSession | None = None

        return

    async def __process_item(
        self, item: ElementTree.Element
    ) -> SearchResultData | None:
        torznab_keys = {
            tor_key.attrib["name"].lower(): tor_key.attrib["value"]
            for tor_key in item.findall(
                "{http://torznab.com/schemas/2015/feed}attr"
            )
            if "name" in tor_key.attrib and "value" in tor_key.attrib
        }

        # Title
        title_el = item.find("title")
        if title_el is None:
            return None
        title = title_el.text or ""
        if not title:
            return None

        # Link
        link = torznab_keys.get("magneturl") or ""
        if not link and "infohash" in torznab_keys:
            link = build_magnet_link(torznab_keys["infohash"].lower(), title)
        enclosure = item.find("enclosure")
        if not link and enclosure is not None:
            link = enclosure.attrib.get("url") or ""
        if not link:
            link_el = item.find("link")
            if link_el is not None:
                link = link_el.text or ""
        if not link:
            return None
        link = unquote(unescape(link))

        # Size
        size = torznab_keys.get("size", "")
        if (
            not size
            and enclosure is not None
            and enclosure.attrib.get("length")
        ):
            size = enclosure.attrib.get("length", "")
        if not size:
            size_el = item.find("size")
            if size_el is not None:
                size = size_el.text or ""
        parsed_size = int(size) if size.isdigit() else None

        # Seeders/Leechers
        seeders, leechers = None, None
        if torznab_keys.get("seeders", "").isdigit():
            seeders = int(torznab_keys["seeders"])
        if torznab_keys.get("peers", "").isdigit():
            leechers = int(torznab_keys["peers"])

        efd = extract_filename_data(
            filepath=title, assume_volume_number=False, fix_year=True
        )

        return SearchResultData(
            series=efd["series"],
            year=efd["year"],
            volume_number=efd["volume_number"],
            special_version=efd["special_version"],
            issue_number=efd["issue_number"],
            annual=efd["annual"],
            is_metadata_file=efd["is_metadata_file"],
            is_image_file=efd["is_image_file"],
            link=link,
            display_title=title,
            indexer_id=self._id,
            indexer_title=self._title,
            filesize=parsed_size,
            pages=None,
            releaser=None,
            scan_type=None,
            resolution=None,
            dpi=None,
            extension=None,
            comics_id=None,
            md5=None,
            web_sub_title=None,
            download_sources=[],
            selected_source=None,
            seeders=seeders,
            leechers=leechers,
            notes=None,
        )

    async def search(self, query: SearchQuery) -> QueryResult:
        if not self.session:
            self.session = AsyncSession()

        results = await self.session.get_text(
            self._url + (self._api_path or ""),
            params={
                "t": "search",
                "apikey": self._api_key,
                "extended": 1,
                "q": query["query"],
                "cat": str(self._categories or ""),
            },
            quiet_fail=True,
        )
        if not results:
            return QueryResult([], next_page_available=False)

        formatted_results: list[SearchResultData] = []
        for item in ElementTree.XML(results).iter("item"):
            processed_item = await self.__process_item(item)
            if processed_item is not None:
                formatted_results.append(processed_item)

        return QueryResult(formatted_results, next_page_available=False)

    async def discover(self, last_check: datetime) -> list[SearchResultData]:
        return []

    async def shutdown(self) -> None:
        if self.session:
            await self.session.close()
        return

    @classmethod
    def test(cls, url: str, **extra_fields: Any) -> None:
        api_path: str = extra_fields["api_path"]
        api_key: str = extra_fields["api_key"]

        with Session() as session:
            try:
                response = session.get(
                    url + (api_path or ""),
                    params={"t": "caps", "apikey": api_key},
                )
                if response.status_code in (401, 403):
                    raise CredentialInvalid

                if not response.ok:
                    raise ClientNotWorking(BrokenClientReason.CONNECTION_ERROR)

                if response.headers["Content-Type"] not in (
                    "application/xml",
                    "application/rss",
                    "application/rss+xml",
                ):
                    raise ClientNotWorking(
                        BrokenClientReason.NOT_CLIENT_INSTANCE
                    )

                root = ElementTree.XML(response.text)
                if (
                    root.tag == "error"
                    and 100 <= int(root.attrib.get("code") or -1) <= 107
                ):
                    raise CredentialInvalid

                if root.tag != "caps":
                    raise ClientNotWorking(
                        BrokenClientReason.NOT_CLIENT_INSTANCE
                    )

            except RequestException:
                raise ClientNotWorking(BrokenClientReason.CONNECTION_ERROR)

        return
