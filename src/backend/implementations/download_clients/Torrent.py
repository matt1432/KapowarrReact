from __future__ import annotations

from os.path import basename, join, splitext
from threading import Event
from typing import Any

import requests
from requests import RequestException

from backend.base.custom_exceptions import (
    ClientNotWorking,
    IssueNotFound,
    LinkBroken,
)
from backend.base.definitions import (
    DownloadClientIdentifier,
    DownloadSource,
    DownloadState,
    DownloadType,
    ExternalDownload,
    ExternalDownloadClient,
    FileExtraInfo,
)
from backend.base.helpers import Session, get_torrent_info
from backend.base.logging import LOGGER
from backend.implementations.download_client_manager import DownloadClients
from backend.implementations.download_clients.base import BaseDirectDownload
from backend.implementations.external_client_manager import ExternalClients
from backend.implementations.external_clients.torrent.qBittorrent import (
    qBittorrent,
)
from backend.implementations.naming import generate_issue_name
from backend.implementations.remote_mapping import RemoteMappings
from backend.implementations.volumes import Volume
from backend.internals.db import get_db
from backend.internals.settings import Settings


@DownloadClients.register_client(DownloadClientIdentifier.TORRENT)
class TorrentDownload(ExternalDownload, BaseDirectDownload):
    @property
    def external_client(self) -> ExternalDownloadClient:
        return self._external_client

    @external_client.setter
    def external_client(self, value: ExternalDownloadClient) -> None:
        self._external_client = value
        return

    @property
    def external_id(self) -> str | None:
        return self._external_id

    @property
    def filename(self) -> str | None:
        return self._filename

    @property
    def sleep_event(self) -> Event:
        return self._sleep_event

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
        issue_id: int | None = None,
        forced_match: bool = False,
        external_client: ExternalDownloadClient | None = None,
        external_id: str | None = None,
        filename: str | None = None,
        releaser: str | None = None,
        scan_type: str | None = None,
        resolution: str | None = None,
        dpi: str | None = None,
        extension: str | None = None,
    ) -> None:
        LOGGER.debug("Creating download: %s", download_link)

        settings = Settings().sv
        volume = Volume(volume_id)

        self._download_link = self._pure_link = download_link
        self._volume_id = volume_id
        self._issue_id = None
        self._covered_issues = covered_issues
        self._source_type = source_type
        self._source_name = source_name
        self._web_link = web_link
        self._web_title = web_title
        self._web_sub_title = web_sub_title
        self._external_id = external_id
        self._filename = filename

        self._id = None
        self._state = DownloadState.QUEUED_STATE
        self._progress = 0.0
        self._speed = 0.0
        self._size = -1
        self._download_thread = None
        self._download_folder = settings.download_folder
        self._sleep_event = Event()

        self._releaser = releaser
        self._scan_type = scan_type
        self._resolution = resolution
        self._dpi = dpi
        self._extension = extension

        self._original_files: list[str] = []
        if external_client:
            self._external_client = external_client
            if external_id and isinstance(self._external_client, qBittorrent):
                self._external_client.torrent_hashes[external_id] = None
        else:
            self._external_client = ExternalClients.get_least_used_client(
                DownloadType.TORRENT
            )

        try:
            if isinstance(covered_issues, float):
                self._issue_id = volume.get_issue_from_number(covered_issues).id

        except IssueNotFound as e:
            if not forced_match:
                raise e

        # Find name of torrent as that becomes folder that media is
        # downloaded in
        if download_link.startswith("magnet"):
            try:
                response = Session().post(
                    "https://magnet2torrent.com/upload/",
                    data={"magnet": download_link},
                )
                response.raise_for_status()
                if (
                    response.headers.get("Content-Type")
                    != "application/x-bittorrent"
                ):
                    raise RequestException

            except RequestException:
                raise LinkBroken(self.download_link)

            torrent_name = get_torrent_info(response.content)[b"name"].decode()
        else:
            torrent_name = get_torrent_info(
                requests.get(download_link).content
            )[b"name"].decode()

        self._filename_body = ""
        if settings.rename_downloaded_files:
            try:
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
            self._filename_body = splitext(torrent_name)[0]

        self._title = basename(self._filename_body)
        self._files = [join(self._download_folder, torrent_name)]
        return

    def run(self) -> None:
        if not self.external_id:
            try:
                self._external_id = self.external_client.add_download(
                    self.download_link,
                    RemoteMappings.local_to_remote(
                        self._external_client.id,
                        self._download_folder
                        if not self._filename
                        else join(self._download_folder, self._filename),
                    ),
                    self.title,
                    self._filename,
                )
                if self.id:
                    get_db().execute(
                        "UPDATE download_queue SET external_id = ? WHERE id = ?;",
                        (self.external_id, self.id),
                    )
            except ClientNotWorking:
                self.state = DownloadState.FAILED_STATE
                self.remove_from_client(True)
        return

    def update_status(self) -> None:
        if not self.external_id:
            return

        torrent_status = self.external_client.get_download(self.external_id)
        if not torrent_status:
            if torrent_status is None:
                self._state = DownloadState.CANCELED_STATE
            return

        self._progress = torrent_status["progress"]
        self._speed = torrent_status["speed"]
        self._size = torrent_status["size"]
        if self.state not in (
            DownloadState.CANCELED_STATE,
            DownloadState.SHUTDOWN_STATE,
        ):
            self._state = torrent_status["state"]

        return

    def remove_from_client(self, delete_files: bool) -> None:
        if not self.external_id:
            return

        self.external_client.delete_download(self.external_id, delete_files)
        return

    def stop(self, state: DownloadState = DownloadState.CANCELED_STATE) -> None:
        self._state = state
        self._sleep_event.set()
        return

    def as_dict(self) -> dict[str, Any]:
        return {
            **super().as_dict(),
            "client": self.external_client.id
            if self._external_client
            else None,
        }
