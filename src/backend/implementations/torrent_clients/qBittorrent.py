from collections.abc import Sequence
from re import IGNORECASE, compile
from time import time

import requests
from qbittorrentapi import Client

from backend.base.custom_exceptions import ClientNotWorking
from backend.base.definitions import (
    BrokenClientReason,
    Constants,
    DownloadState,
    DownloadType,
)
from backend.base.logging import LOGGER
from backend.implementations.external_clients import BaseExternalClient
from backend.internals.settings import Settings

filename_magnet_link = compile(r"(?<=&dn=).*?(?=&)", IGNORECASE)


class qBittorrent(BaseExternalClient):
    client_type = "qBittorrent"
    download_type = DownloadType.TORRENT

    required_tokens: Sequence[str] = (
        "title",
        "base_url",
        "username",
        "password",
    )

    state_mapping = {
        "queuedDL": DownloadState.QUEUED_STATE,
        "pausedDL": DownloadState.PAUSED_STATE,
        "stoppedDL": DownloadState.PAUSED_STATE,
        "stalledDL": DownloadState.DOWNLOADING_STATE,
        "checkingDL": DownloadState.DOWNLOADING_STATE,
        "metaDL": DownloadState.DOWNLOADING_STATE,
        "checkingResumeData": DownloadState.DOWNLOADING_STATE,
        "downloading": DownloadState.DOWNLOADING_STATE,
        "forcedDL": DownloadState.DOWNLOADING_STATE,
        "queuedUP": DownloadState.SEEDING_STATE,
        "uploading": DownloadState.SEEDING_STATE,
        "forcedUP": DownloadState.SEEDING_STATE,
        "checkingUP": DownloadState.SEEDING_STATE,
        "stalledUP": DownloadState.SEEDING_STATE,
        "pausedUP": DownloadState.IMPORTING_STATE,
        "error": DownloadState.FAILED_STATE,
    }

    def __init__(self, client_id: int) -> None:
        super().__init__(client_id)

        self.ssn: Client | None = None
        self.torrent_hashes: dict[str, int | None] = {}
        self.settings = Settings()
        return

    @staticmethod
    def _login(
        base_url: str, username: str | None, password: str | None
    ) -> Client:
        """Login into qBittorrent client.
        Args:
            base_url (str): Base URL of instance.
            username (Union[str, None]): Username to access client, if set.
            password (Union[str, None]): Password to access client, if set.

        Raises:
            ClientNotWorking: Can't connect to client.
            CredentialInvalid: Credentials are invalid.

        Returns:
            Session: Request session that is logged in.
        """
        try:
            ssn = Client(host=base_url, username=username, password=password)

        except Exception:
            LOGGER.exception("Can't connect to qBittorrent instance: ")
            raise ClientNotWorking(BrokenClientReason.CONNECTION_ERROR)

        return ssn

    def add_download(
        self,
        download_link: str,
        target_folder: str,
        download_name: str | None,
        filename: str | None = None,
    ) -> str:
        if download_name is not None:
            download_link = filename_magnet_link.sub(
                download_name, download_link
            )

        if not self.ssn:
            self.ssn = self._login(self.base_url, self.username, self.password)

        if download_link.startswith("magnet"):
            self.ssn.torrents_add(
                urls=download_link,
                save_path=target_folder,
                category=Constants.TORRENT_TAG,
            )
            t_hash = download_link.split("urn:btih:")[1].split("&")[0]
        else:
            is_stopped = filename is not None
            list_before = self.ssn.torrents_info().data

            self.ssn.torrents_add(
                torrent_files=requests.get(download_link).content,
                save_path=target_folder,
                category=Constants.TORRENT_TAG,
                is_stopped=is_stopped,
            )

            t_hash = None

            while t_hash is None:
                list_after = self.ssn.torrents_info().data
                new_torrent_list = [
                    item for item in list_after if item not in list_before
                ]
                if new_torrent_list:
                    new_torrent = new_torrent_list[0]
                    t_hash = new_torrent.hash

            if is_stopped:
                for file in self.ssn.torrents_files(torrent_hash=t_hash).data:
                    if file and file.name != filename:
                        self.ssn.torrents_file_priority(
                            torrent_hash=t_hash, file_ids=file.id, priority=0
                        )
                    elif file:
                        self.ssn.torrents_file_priority(
                            torrent_hash=t_hash, file_ids=file.id, priority=1
                        )
                self.ssn.torrents_resume(torrent_hashes=t_hash)

        if t_hash is None:
            raise ClientNotWorking(
                BrokenClientReason.FAILED_PROCESSING_RESPONSE
            )

        self.torrent_hashes[t_hash] = None
        return t_hash

    def get_download(self, download_id: str) -> dict | None:
        if not self.ssn:
            self.ssn = self._login(self.base_url, self.username, self.password)

        r = self.ssn.torrents_info(torrent_hashes=download_id).data
        if not r:
            if download_id in self.torrent_hashes:
                return None
            else:
                return {}

        result = r[0]

        state = self.state_mapping.get(
            result.state, DownloadState.IMPORTING_STATE
        )

        if result.state in ("metaDL", "stalledDL", "checkingDL"):
            # Torrent is failing
            if self.torrent_hashes[download_id] is None:
                self.torrent_hashes[download_id] = round(time())
                state = DownloadState.DOWNLOADING_STATE

            else:
                timeout = self.settings.sv.failing_download_timeout
                if timeout and (
                    time() - (self.torrent_hashes[download_id] or 0) > timeout
                ):
                    state = DownloadState.FAILED_STATE
        else:
            self.torrent_hashes[download_id] = None

        return {
            "size": result.size,
            "progress": round(result.progress * 100, 2),
            "speed": result.info["dlspeed"],
            "state": state,
        }

    def delete_download(self, download_id: str, delete_files: bool) -> None:
        if not self.ssn:
            self.ssn = self._login(self.base_url, self.username, self.password)

        self.ssn.torrents_delete(
            torrent_hashes=download_id, delete_files=delete_files
        )

        del self.torrent_hashes[download_id]
        return

    # FIXME: always successful?
    @staticmethod
    def test(
        base_url: str,
        username: str | None = None,
        password: str | None = None,
        api_token: str | None = None,
    ) -> None:
        qBittorrent._login(base_url, username, password)

        return
