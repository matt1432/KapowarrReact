from asyncio import run, sleep

from libgencomics import get_annas_archive_download

from backend.base.custom_exceptions import EnqueuingDownloadFailure
from backend.base.definitions import (
    Constants,
    Download,
    DownloadPrepper,
    DownloadService,
    DownloadType,
    EnqueuingDownloadFailureReason,
    SearchResultData,
)
from backend.base.logging import LOGGER
from backend.implementations.download_clients.DDL import DDLDownload
from backend.implementations.download_clients.Torrent import TorrentDownload
from backend.implementations.download_prepper_manager import DownloadPreppers
from backend.internals.settings import Settings


@DownloadPreppers.register_prepper(DownloadType.DDL, "Libgen+")
class LibgenPlusPrepper(DownloadPrepper):
    @property
    def web_title(self) -> str | None:
        return None

    def __init__(
        self,
        result: SearchResultData,
        volume_id: int,
        issue_id: int | None = None,
        force_match: bool = False,
    ) -> None:
        self.result = result
        self.link = result["link"]
        self.volume_id = volume_id
        self.issue_id = issue_id
        self.force_match = force_match
        return

    def __log_adding(self, download_link: str) -> None:
        LOGGER.info(
            "Adding download for "
            + f"volume {self.volume_id}"
            + (f" issue {self.issue_id}" if self.issue_id else "")
            + f": {download_link}"
        )
        return

    def __get_torrent_download(self) -> Download:
        result = self.result
        torrent_name = str(int(int(result["comics_id"] or 0) / 1000) * 1000)
        torrent_link = f"{Constants.LIBGEN_SITE_URL}/torrents/comics/c_{torrent_name}.torrent"

        self.__log_adding(torrent_link)

        return TorrentDownload(
            download_link=torrent_link,
            volume_id=self.volume_id,
            covered_issues=result.get("issue_number", None),
            download_service=DownloadService.LIBGENPLUS,
            source_name="Libgen+",
            web_link=self.link,
            web_title=None,
            web_sub_title=None,
            forced_match=self.force_match,
            external_client=None,
            external_id=None,
            filename=f"{torrent_name}/{result['md5']}.{result['extension']}",
            releaser=result.get("releaser", None),
            scan_type=result.get("scan_type", None),
            resolution=result.get("resolution", None),
            dpi=result.get("dpi", None),
            extension=result.get("extension", None),
        )

    async def __get_annas_archive_download(self) -> Download:
        from backend.features.download_queue import DownloadHandler

        while DownloadHandler().has_annas_running:
            await sleep(5)

        result = self.result
        download_link = await get_annas_archive_download(
            md5=result["md5"],
            annas_archive_site_url=Constants.ANNAS_ARCHIVE_SITE_URL,
            flaresolverr_url=Settings().sv.flaresolverr_base_url
            + Constants.FS_API_BASE,
        )

        if download_link is None:
            LOGGER.info(
                "Getting Anna's Archive download failed for "
                + f"volume {self.volume_id}"
                + (f" issue {self.issue_id}" if self.issue_id else "")
            )
            raise EnqueuingDownloadFailure(
                EnqueuingDownloadFailureReason.LINK_BROKEN
            )

        self.__log_adding(download_link)

        return DDLDownload(
            download_link=download_link,
            volume_id=self.volume_id,
            covered_issues=result.get("issue_number", None),
            download_service=DownloadService.ANNAS_ARCHIVE,
            source_name="Anna's Archive",
            web_link=self.link,
            web_title=None,
            web_sub_title=None,
            releaser=result.get("releaser", None),
            scan_type=result.get("scan_type", None),
            resolution=result.get("resolution", None),
            dpi=result.get("dpi", None),
            extension=result.get("extension", None),
            forced_match=self.force_match,
        )

    def __get_direct_download(self) -> Download:
        result = self.result
        download_link = self.link.replace("file.php", "get.php")

        self.__log_adding(download_link)

        return DDLDownload(
            download_link=download_link,
            volume_id=self.volume_id,
            covered_issues=result.get("issue_number", None),
            download_service=DownloadService.LIBGENPLUS,
            source_name="Libgen+",
            web_link=self.link,
            web_title=None,
            web_sub_title=None,
            releaser=result.get("releaser", None),
            scan_type=result.get("scan_type", None),
            resolution=result.get("resolution", None),
            dpi=result.get("dpi", None),
            extension=result.get("extension", None),
            forced_match=self.force_match,
        )

    def get_downloads(self) -> list[Download]:
        selected_source = self.result["selected_source"]

        if (
            self.result["comics_id"] is not None
            and selected_source == DownloadService.LIBGENPLUS_TORRENT.value
        ):
            return [self.__get_torrent_download()]

        if selected_source == DownloadService.ANNAS_ARCHIVE.value:
            return [run(self.__get_annas_archive_download())]

        return [self.__get_direct_download()]
