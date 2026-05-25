from __future__ import annotations

from os.path import basename, join, sep, splitext
from re import IGNORECASE, compile
from threading import Thread
from time import perf_counter
from typing import TYPE_CHECKING, Any
from urllib.parse import unquote_plus

from requests import RequestException

from backend.base.custom_exceptions import (
    DownloadLimitReached,
    IssueNotFound,
    LinkBroken,
)
from backend.base.definitions import (
    Constants,
    Download,
    DownloadSource,
    DownloadState,
    FileExtraInfo,
)
from backend.base.helpers import Session
from backend.base.logging import LOGGER
from backend.implementations.naming import generate_issue_name
from backend.implementations.volumes import Volume
from backend.internals.server import QueueStatusEvent, WebSocket
from backend.internals.settings import Settings

if TYPE_CHECKING:
    from requests import Response


file_extension_regex = compile(
    r"(?<=\.|\/)[\w\d]{2,4}(?=$|;|\s|\")", IGNORECASE
)
file_name_regex = compile(
    r"filename(?:=\"|\*=UTF-8\'\')(.*?)\.[a-z]{2,4}\"?$", IGNORECASE
)
DOWNLOAD_CHUNK_SIZE = 4194304  # 4MB Chunks


# region Base Direct Download
class BaseDirectDownload(Download):
    __r: Any | None
    _id: int | None

    @property
    def id(self) -> int | None:
        return self._id

    @id.setter
    def id(self, value: int) -> None:
        self._id = value
        return

    @property
    def volume_id(self) -> int:
        return self._volume_id

    @property
    def issue_id(self) -> int | None:
        return self._issue_id

    @property
    def covered_issues(self) -> float | tuple[float, float] | None:
        return self._covered_issues

    @property
    def web_link(self) -> str | None:
        return self._web_link

    @property
    def web_title(self) -> str | None:
        return self._web_title

    @property
    def web_sub_title(self) -> str | None:
        return self._web_sub_title

    @property
    def download_link(self) -> str:
        return self._download_link

    @property
    def pure_link(self) -> str:
        return self._pure_link

    @property
    def source_type(self) -> DownloadSource:
        return self._source_type

    @property
    def source_name(self) -> str:
        return self._source_name

    @property
    def files(self) -> list[str]:
        return self._files

    @files.setter
    def files(self, value: list[str]) -> None:
        self._files = value
        return

    @property
    def filename_body(self) -> str:
        return self._filename_body

    @property
    def title(self) -> str:
        return self._title

    @property
    def size(self) -> int:
        return self._size

    @property
    def state(self) -> DownloadState:
        return self._state

    @state.setter
    def state(self, value: DownloadState) -> None:
        self._state = value
        return

    @property
    def progress(self) -> float:
        return self._progress

    @property
    def speed(self) -> float:
        return self._speed

    _download_thread: Thread | None

    @property
    def download_thread(self) -> Thread | None:
        return self._download_thread

    @download_thread.setter
    def download_thread(self, value: Thread) -> None:
        self._download_thread = value
        return

    @property
    def download_folder(self) -> str:
        return self._download_folder

    @property
    def releaser(self) -> str | None:
        return self._releaser

    @property
    def scan_type(self) -> str | None:
        return self._scan_type

    @property
    def resolution(self) -> str | None:
        return self._resolution

    @property
    def dpi(self) -> str | None:
        return self._dpi

    @property
    def extension(self) -> str | None:
        return self._extension

    def __init__(
        self,
        *,
        download_link: str,
        volume_id: int,
        covered_issues: float | tuple[float, float] | None,
        source_type: DownloadSource,
        source_name: str,
        web_link: str | None,
        web_title: str | None,
        web_sub_title: str | None,
        releaser: str | None = None,
        scan_type: str | None = None,
        resolution: str | None = None,
        dpi: str | None = None,
        extension: str | None = None,
        forced_match: bool = False,
    ) -> None:
        LOGGER.debug("Creating download: %s", download_link)

        settings = Settings().sv
        volume = Volume(volume_id)

        self.__r = None
        self._download_link = download_link
        self._volume_id = volume_id
        self._issue_id = None
        self._covered_issues = covered_issues
        self._source_type = source_type
        self._source_name = source_name
        self._web_link = web_link
        self._web_title = web_title
        self._web_sub_title = web_sub_title

        self._id = None
        self._state = DownloadState.QUEUED_STATE
        self._progress = 0.0
        self._speed = 0.0
        self._download_thread = None
        self._download_folder = settings.download_folder

        self._releaser = releaser
        self._scan_type = scan_type
        self._resolution = resolution
        self._dpi = dpi
        self._extension = extension

        self._ssn = Session()

        # Create and fetch pure link to extract last info
        # This can fail if the link is broken, so do before other
        # intensive tasks to save time (no need to do intensive tasks when
        # link is broken).
        try:
            self._pure_link = self._convert_to_pure_link()
            with self._fetch_pure_link() as response:
                response.raise_for_status()
                self._ssn.close()

        except RequestException as e:
            if (
                e.response is not None
                and e.response.url.startswith(Constants.PIXELDRAIN_API_URL)
                and e.response.status_code == 403
            ):
                # Pixeldrain rate limit because of hotlinking
                raise DownloadLimitReached(DownloadSource.PIXELDRAIN)

            raise LinkBroken(download_link)

        self._size = int(response.headers.get("Content-Length", -1))
        self._supports_range_header = (
            response.headers.get("Accept-Ranges") == "bytes"
        )

        self._filename_body = ""
        try:
            if isinstance(covered_issues, float):
                self._issue_id = volume.get_issue_from_number(covered_issues).id

            if settings.rename_downloaded_files:
                self._filename_body = generate_issue_name(
                    volume_data=volume.get_data(),
                    calculated_issue_number=covered_issues,
                    file_data=FileExtraInfo(
                        releaser=releaser,
                        scan_type=scan_type,
                        resolution=resolution,
                        dpi=dpi,
                        notes=None,
                    ),
                )

        except IssueNotFound as e:
            if not forced_match:
                raise e

        if not self._filename_body:
            self._filename_body = self._extract_default_filename_body(response)

        self._title = basename(self._filename_body)
        self._files = [self._build_filename(response)]
        return

    def _convert_to_pure_link(self) -> str:
        return self.download_link

    def _fetch_pure_link(self, start_byte: int | None = None) -> Response:
        headers = {}
        if start_byte is not None and self._supports_range_header:
            headers["Range"] = f"bytes={start_byte}-"

        return self._ssn.get(self.pure_link, headers=headers, stream=True)

    def _extract_default_filename_body(self, response: Response | None) -> str:
        if response and response.headers.get("Content-Disposition"):
            file_result = file_name_regex.search(
                response.headers["Content-Disposition"]
            )
            if file_result:
                return unquote_plus(file_result.group(1))

        return splitext(
            unquote_plus(self.pure_link.split("/")[-1].split("?")[0])
        )[0]

    def _extract_extension(self, response: Response | None) -> str:
        if self.extension is not None:
            return f".{self.extension}"

        if not response:
            return ""

        match = file_extension_regex.findall(
            " ".join(
                (
                    response.headers.get("Content-Disposition", ""),
                    response.headers.get("Content-Type", ""),
                    response.url,
                )
            )
        )
        if match:
            return "." + match[0]
        return ""

    def _build_filename(self, response: Response | None) -> str:
        extension = self._extract_extension(response)
        return join(
            self._download_folder,
            "_".join(self._filename_body.split(sep)) + extension,
        )

    def run(self) -> None:
        self._state = DownloadState.DOWNLOADING_STATE
        size_downloaded = 0

        ws = WebSocket()
        status_event = QueueStatusEvent(self)
        ws.emit(status_event)

        start_time = perf_counter()
        tries_left = Constants.TOTAL_RETRIES
        is_stopped = False
        with open(self.files[0], "wb") as f:
            while tries_left > 0:
                tries_left -= 1
                if not self._supports_range_header:
                    size_downloaded = 0

                with self._fetch_pure_link(start_byte=size_downloaded) as r:
                    self.__r = r
                    try:
                        for chunk in r.iter_content(
                            chunk_size=DOWNLOAD_CHUNK_SIZE
                        ):
                            if self.state in (
                                DownloadState.CANCELED_STATE,
                                DownloadState.SHUTDOWN_STATE,
                            ):
                                is_stopped = True
                                break

                            f.write(chunk)

                            # Update progress
                            chunk_size = len(chunk)
                            size_downloaded += chunk_size
                            self._speed = round(
                                chunk_size / (perf_counter() - start_time), 2
                            )
                            if self.size == -1:
                                # No file size so progress is amount downloaded
                                self._progress = size_downloaded
                            else:
                                self._progress = round(
                                    size_downloaded / self.size * 100, 2
                                )

                            start_time = perf_counter()
                            ws.emit(status_event)

                        else:
                            # Success
                            break

                        if is_stopped:
                            # Stopping download
                            break

                    except RequestException:
                        # Connection error, packet loss, etc. Just try again
                        self._speed = 0
                        start_time = perf_counter()
                        ws.emit(status_event)
                        pass

                    finally:
                        self.__r = None
            else:
                # Failed to download file
                self._state = DownloadState.FAILED_STATE

        if not is_stopped and self.size != -1 and size_downloaded != self.size:
            # Download completed, but downloaded size is not equal
            # to reported size of file
            self._state = DownloadState.FAILED_STATE

        return

    def stop(self, state: DownloadState = DownloadState.CANCELED_STATE) -> None:
        self._state = state

        if (
            self.__r
            and self.__r.raw._fp
            and not isinstance(self.__r.raw._fp, str)
        ):
            try:
                self.__r.raw._fp.fp.raw._sock.shutdown(2)  # SHUT_RDWR
            except OSError as e:
                if e.errno != 9:
                    raise

        return

    def as_dict(self) -> dict[str, Any]:
        return {
            "id": self._id,
            "volume_id": self._volume_id,
            "issue_id": self._issue_id,
            "web_link": self._web_link,
            "web_title": self._web_title,
            "web_sub_title": self._web_sub_title,
            "download_link": self._download_link,
            "pure_link": self._pure_link,
            "source_type": self._source_type.value,
            "source_name": self._source_name,
            "type": self.identifier,
            "file": self._files[0],
            "title": self._title,
            "download_folder": self._download_folder,
            "size": self._size,
            "status": self._state.value,
            "progress": self._progress,
            "speed": self._speed,
        }
