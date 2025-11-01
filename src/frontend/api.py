from asyncio import run
from collections.abc import Callable
from datetime import datetime
from io import BytesIO
from typing import Any

from flask import Blueprint, Request, Response, request, send_file

from backend.base.custom_exceptions import (
    InvalidKeyValue,
    KeyNotFound,
    TaskNotFound,
)
from backend.base.definitions import (
    BlocklistReason,
    BlocklistReasonID,
    CredentialData,
    CredentialSource,
    DownloadSource,
    KapowarrException,
    LibraryFilter,
    LibrarySorting,
    MonitorScheme,
    SearchResultData,
    SpecialVersion,
    StartType,
    ThumbnailData,
    VolumeData,
)
from backend.base.helpers import hash_password
from backend.base.logging import LOGGER, get_log_file_contents
from backend.features.download_queue import (
    DownloadHandler,
    delete_download_history,
    get_download_history,
    get_download_history_total_records,
)
from backend.features.edit_content import (
    get_issue_page_thumbnail,
    get_issue_page_thumbnails,
    update_issue_pages,
)
from backend.features.library_import import (
    import_library,
    propose_library_import,
)
from backend.features.mass_edit import run_mass_editor_action
from backend.features.search import manual_search
from backend.features.tasks import (
    Task,
    TaskHandler,
    delete_task_history,
    get_task_history,
    get_task_planning,
    task_library,
)
from backend.implementations.blocklist import (
    add_to_blocklist,
    delete_blocklist,
    delete_blocklist_entry,
    get_blocklist,
    get_blocklist_entry,
    get_blocklist_total_records,
)
from backend.implementations.comicvine import ComicVine
from backend.implementations.conversion import (
    FileConversionHandler,
    preview_mass_convert,
)
from backend.implementations.credentials import Credentials
from backend.implementations.external_clients import ExternalClients
from backend.implementations.matching import parse_covered_issues
from backend.implementations.naming import (
    generate_volume_folder_name,
    preview_mass_rename,
)
from backend.implementations.remote_mapping import RemoteMappings
from backend.implementations.root_folders import RootFolders
from backend.implementations.volumes import Library, delete_issue_file
from backend.internals.db_models import FilesDB
from backend.internals.server import SERVER, diffuse_timers
from backend.internals.settings import Settings, get_about_data

api = Blueprint("api", __name__)
library = Library()

type ApiReturn = tuple[dict[str, Any], int]


def return_api(
    result: Any, error: str | None = None, code: int = 200
) -> ApiReturn:
    return {"error": error, "result": result}, code


def error_handler(method: Callable[[Any], Any]) -> Any:
    """Used as decodator. Catches the errors that can occur in the endpoint and returns the correct api error"""

    def wrapper(*args: Any, **kwargs: Any) -> Any:
        try:
            return method(*args, **kwargs)

        except KapowarrException as e:
            return return_api(**e.api_response)

    wrapper.__name__ = method.__name__
    return wrapper


def extract_key(
    request: Request, key: str, check_existence: bool = True
) -> Any:
    """Extract and format a value of a parameter from a request

    Args:
        request (Request): The request from which to get the values.
        key (str): The key of which to get and format the value.
        check_existence (bool, optional): Require the key to be given in the request. Defaults to True.

    Raises:
        KeyNotFound: The key is not found in the request.
        InvalidKeyValue: The value of a key is invalid.
        TaskNotFound: The task was not found

    Returns:
        Any: The formatted value of the key.
    """

    if key == "result":
        try:

            def parse_int(key: str) -> int | None:
                val = request.values.get(key)
                return None if val is None else int(val)

            def parse_bool(key: str) -> bool | None:
                val = request.values.get(key)
                return None if val is None else bool(val)

            return SearchResultData(
                series=request.values.get("series") or "",
                year=parse_int("year"),
                volume_number=parse_int("volume_number"),
                special_version=request.values.get("special_version"),
                issue_number=parse_covered_issues(
                    request.values.get("issue_number")
                ),
                annual=parse_bool("annual") or False,
                is_metadata_file=parse_bool("is_metadata_file") or False,
                is_image_file=parse_bool("is_image_file") or False,
                link=request.values.get("link") or "",
                display_title=request.values.get("display_title") or "",
                source=request.values.get("source") or "",
                filesize=parse_int("filesize"),
                pages=parse_int("pages"),
                releaser=request.values.get("releaser"),
                scan_type=request.values.get("scan_type"),
                resolution=request.values.get("resolution"),
                dpi=request.values.get("dpi"),
                extension=request.values.get("extension"),
                comics_id=parse_int("comics_id"),
                md5=request.values.get("md5") or request.values.get("md_5"),
            )

        except (ValueError, TypeError):
            raise InvalidKeyValue(key)

    value: Any = request.values.get(key)
    if check_existence and value is None:
        raise KeyNotFound(key)

    if value is not None:
        # Check value
        if key in ("volume_id", "issue_id"):
            try:
                value = int(value)
                if key == "volume_id":
                    library.get_volume(value)
                else:
                    library.get_issue(value)
            except (ValueError, TypeError):
                raise InvalidKeyValue(key, value)

        elif key == "cmd":
            value = task_library.get(value)
            if value is None:
                raise TaskNotFound(value)

        elif key == "api_key":
            if not value or value != Settings().sv.api_key:
                raise InvalidKeyValue(key, value)

        elif key == "sort":
            try:
                value = LibrarySorting[value.upper()]
            except KeyError:
                raise InvalidKeyValue(key, value)

        elif key == "filter":
            try:
                value = LibraryFilter[value.upper()] if value else None
            except KeyError:
                raise InvalidKeyValue(key, value)

        elif key in (
            "root_folder_id",
            "root_folder",
            "offset",
            "limit",
            "index",
        ):
            try:
                value = int(value)
            except (ValueError, TypeError):
                raise InvalidKeyValue(key, value)

        elif key in (
            "monitor",
            "delete_folder",
            "rename_files",
            "only_english",
            "limit_parent_folder",
            "force_match",
        ):
            if value == "true":
                value = True
            elif value == "false":
                value = False
            else:
                raise InvalidKeyValue(key, value)

        elif key in ("query", "folder_filter"):
            if not value:
                raise InvalidKeyValue(key, value)

    else:
        # Default value
        if key == "sort":
            value = "title"

        elif key == "filter":
            value = None

        elif key == "monitor":
            value = True

        elif key == "delete_folder":
            value = False

        elif key == "offset":
            value = 0

        elif key == "rename_files":
            value = False

        elif key == "limit":
            value = 20

        elif key == "only_english":
            value = True

        elif key == "limit_parent_folder":
            value = False

        elif key == "force_match":
            value = False

    return value


# =====================
# Authentication function and endpoints
# =====================


def auth(method: Callable) -> Any:
    """Used as decorator and, if applied to route, restricts the route to authorized users only"""

    def wrapper(*args: Any, **kwargs: Any) -> Any:
        if not request.path.endswith("/cover"):
            LOGGER.debug(f"{request.method} {request.path}")

        try:
            extract_key(request, "api_key")
        except (KeyNotFound, InvalidKeyValue):
            ip = request.environ.get(
                "HTTP_X_FORWARDED_FOR", request.remote_addr
            )
            LOGGER.warning(f"Unauthorised request from {ip}")
            return return_api({}, "ApiKeyInvalid", 401)

        diffuse_timers()

        result = method(*args, **kwargs)

        if result[1] > 300:
            LOGGER.debug(
                f"{request.method} {request.path} {result[1]} {result[0]}"
            )

        return result

    wrapper.__name__ = method.__name__
    return wrapper


@api.route("/auth", methods=["POST"])
def api_auth() -> ApiReturn:
    settings = Settings().get_settings()

    ip = request.environ.get("HTTP_X_FORWARDED_FOR", request.remote_addr)

    if settings.auth_password:
        given_password = request.get_json().get("password") or None
        if given_password is None:
            LOGGER.warning(f"Login attempt failed from {ip}")
            return return_api({}, "PasswordInvalid", 401)

        hashed_attempt = hash_password(settings.auth_salt, given_password)
        if hashed_attempt != settings.auth_password:
            LOGGER.warning(f"Login attempt failed from {ip}")
            return return_api({}, "PasswordInvalid", 401)

    LOGGER.info(f"Login attempt successful from {ip}")
    return return_api({"api_key": settings.api_key})


@api.route("/auth/check", methods=["POST"])
@error_handler
@auth
def api_auth_check() -> ApiReturn:
    return return_api({})


# =====================
# Tasks
# =====================


@api.route("/system/about", methods=["GET"])
@error_handler
@auth
def api_about() -> ApiReturn:
    return return_api(get_about_data())


@api.route("/system/logs", methods=["GET"])
@error_handler
@auth
def api_logs() -> tuple[Response, int]:
    sio = get_log_file_contents()

    return send_file(
        BytesIO(sio.getvalue().encode("utf-8")),
        mimetype="application/octet-stream",
        download_name=f"Kapowarr_log_{datetime.now().strftime('%Y_%m_%d_%H_%M')}.txt",
    ), 200


@api.route("/system/tasks", methods=["GET", "POST"])
@error_handler
@auth
def api_tasks() -> ApiReturn | None:
    task_handler = TaskHandler()

    if request.method == "GET":
        tasks = task_handler.get_all()
        return return_api(tasks)

    elif request.method == "POST":
        data = request.get_json()
        if not isinstance(data, dict):
            raise InvalidKeyValue(value=data)

        task: type[Task] | None = task_library.get(data.get("cmd", ""))
        if not task:
            raise TaskNotFound(data.get("cmd", ""))

        kwargs = {}
        kwargs["called_from"] = data.get("called_from", "")
        if task.action in (
            "refresh_and_scan",
            "auto_search",
            "auto_search_issue",
            "mass_rename",
            "mass_rename_issue",
            "mass_convert",
            "mass_convert_issue",
        ):
            volume_id = data.get("volume_id")
            if not volume_id or not isinstance(volume_id, int):
                raise InvalidKeyValue("volume_id", volume_id)
            kwargs["volume_id"] = volume_id

        if task.action in (
            "auto_search_issue",
            "mass_rename_issue",
            "mass_convert_issue",
        ):
            issue_id = data.get("issue_id")
            if not issue_id or not isinstance(issue_id, int):
                raise InvalidKeyValue("issue_id", issue_id)
            kwargs["issue_id"] = issue_id

        if task.action in (
            "mass_rename",
            "mass_rename_issue",
            "mass_convert",
            "mass_convert_issue",
        ):
            filepath_filter = data.get("filepath_filter")
            if not (
                filepath_filter is None or isinstance(filepath_filter, list)
            ):
                raise InvalidKeyValue("filepath_filter", filepath_filter)
            kwargs["filepath_filter"] = filepath_filter or []

        if task.action == "update_all":
            allow_skipping = data.get("allow_skipping", True)
            if not isinstance(allow_skipping, bool):
                raise InvalidKeyValue("allow_skipping", allow_skipping)
            kwargs["allow_skipping"] = allow_skipping

        task_instance = task(**kwargs)
        result = task_handler.add(task_instance)
        return return_api({"id": result}, code=201)


@api.route("/system/tasks/history", methods=["GET", "DELETE"])
@error_handler
@auth
def api_task_history() -> ApiReturn | None:
    if request.method == "GET":
        offset = extract_key(request, "offset", False)
        tasks = get_task_history(offset)
        return return_api(tasks)

    elif request.method == "DELETE":
        delete_task_history()
        return return_api({})


@api.route("/system/tasks/planning", methods=["GET"])
@error_handler
@auth
def api_task_planning() -> ApiReturn:
    result = get_task_planning()
    return return_api(result)


@api.route("/system/tasks/<int:task_id>", methods=["GET", "DELETE"])
@error_handler
@auth
def api_task(task_id: int) -> ApiReturn | None:
    task_handler = TaskHandler()

    if request.method == "GET":
        task = task_handler.get_one(task_id)
        return return_api(task)

    elif request.method == "DELETE":
        task_handler.remove(task_id)
        return return_api({})


@api.route("/system/power/shutdown", methods=["POST"])
@error_handler
@auth
def api_shutdown() -> ApiReturn:
    SERVER.shutdown()
    return return_api({})


@api.route("/system/power/restart", methods=["POST"])
@error_handler
@auth
def api_restart() -> ApiReturn:
    SERVER.restart()
    return return_api({})


# =====================
# Settings
# =====================


@api.route("/settings", methods=["GET", "PUT", "DELETE"])
@error_handler
@auth
def api_settings() -> ApiReturn | None:
    settings = Settings()
    if request.method == "GET":
        result = settings.get_public_settings().todict()
        return return_api(result)

    elif request.method == "PUT":
        data = request.get_json()

        hosting_changes = any(
            s in data
            and data[s] is not None
            and data[s] != getattr(settings.sv, s)
            for s in ("host", "port", "url_base")
        )

        if hosting_changes:
            settings.backup_hosting_settings()

        settings.update(
            {k: v for k, v in data.items() if v is not None}, from_public=True
        )

        if hosting_changes:
            SERVER.restart(StartType.RESTART_HOSTING_CHANGES)

        return return_api(settings.get_public_settings().todict())

    elif request.method == "DELETE":
        data = request.get_json()

        reset_keys = data.get("reset_keys")
        if not (
            isinstance(reset_keys, list)
            and all(isinstance(k, str) for k in reset_keys)
        ):
            raise InvalidKeyValue("reset_keys", reset_keys)

        hosting_changes = any(
            s in reset_keys
            and settings.get_default_value(s) != getattr(settings.sv, s)
            for s in ("host", "port", "url_prefix")
        )

        if hosting_changes:
            settings.backup_hosting_settings()

        for reset_key in reset_keys:
            settings.reset(reset_key, from_public=True)

        if hosting_changes:
            SERVER.restart(StartType.RESTART_HOSTING_CHANGES)

        return return_api(settings.get_public_settings().todict())


@api.route("/settings/api_key", methods=["POST"])
@error_handler
@auth
def api_settings_api_key() -> ApiReturn:
    settings = Settings()
    settings.generate_api_key()
    return return_api(settings.get_public_settings().todict())


@api.route("/settings/availableformats", methods=["GET"])
@error_handler
@auth
def api_settings_available_formats() -> ApiReturn:
    result = list(FileConversionHandler.get_available_formats())
    return return_api(result)


@api.route("/rootfolder", methods=["GET", "POST"])
@error_handler
@auth
def api_rootfolder() -> ApiReturn | None:
    root_folders = RootFolders()

    if request.method == "GET":
        result = [rf.todict() for rf in root_folders.get_all()]
        return return_api(result)

    elif request.method == "POST":
        data: dict = request.get_json()
        folder = data.get("folder")
        if folder is None:
            raise KeyNotFound("folder")
        root_folder = root_folders.add(folder).todict()
        return return_api(root_folder, code=201)


@api.route("/rootfolder/<int:id>", methods=["GET", "PUT", "DELETE"])
@error_handler
@auth
def api_rootfolder_id(id: int) -> ApiReturn | None:
    root_folders = RootFolders()

    if request.method == "GET":
        root_folder = root_folders.get_one(id).todict()
        return return_api(root_folder)

    elif request.method == "PUT":
        folder: str | None = request.get_json().get("folder")
        if not folder:
            raise KeyNotFound("folder")
        root_folders[id] = folder
        return return_api({})

    elif request.method == "DELETE":
        root_folders.delete(id)
        return return_api({})


@api.route("/remotemapping", methods=["GET", "POST"])
@error_handler
@auth
def api_remote_mappings() -> ApiReturn | None:
    remote_mappings = RemoteMappings

    if request.method == "GET":
        return return_api(remote_mappings.get_all())

    elif request.method == "POST":
        data: dict = request.get_json()

        external_download_client_id = data.get("external_download_client_id")
        remote_path = data.get("remote_path")
        local_path = data.get("local_path")

        if (
            not isinstance(external_download_client_id, int)
            or external_download_client_id < 1
        ):
            raise InvalidKeyValue(
                "external_download_client_id", external_download_client_id
            )

        if not isinstance(remote_path, str) or not remote_path:
            raise InvalidKeyValue("remote_path", remote_path)

        if not isinstance(local_path, str) or not local_path:
            raise InvalidKeyValue("local_path", local_path)

        result = remote_mappings.add(
            external_download_client_id, remote_path, local_path
        ).get()
        return return_api(result, code=201)


@api.route("/remotemapping/<int:id>", methods=["GET", "PUT", "DELETE"])
@error_handler
@auth
def api_remote_mapping(id: int) -> ApiReturn | None:
    remote_mapping = RemoteMappings.get_one(id)

    if request.method == "GET":
        return return_api(remote_mapping.get())

    elif request.method == "PUT":
        data: dict = request.get_json()

        external_download_client_id = data.get("external_download_client_id")
        remote_path = data.get("remote_path")
        local_path = data.get("local_path")

        if not (
            external_download_client_id is None
            or (
                isinstance(external_download_client_id, int)
                and external_download_client_id >= 1
            )
        ):
            raise InvalidKeyValue(
                "external_download_client_id", external_download_client_id
            )

        if not (
            remote_path is None
            or (isinstance(remote_path, str) and remote_path)
        ):
            raise InvalidKeyValue("remote_path", remote_path)

        if not (
            local_path is None or (isinstance(local_path, str) and local_path)
        ):
            raise InvalidKeyValue("local_path", local_path)

        result = remote_mapping.update(
            external_download_client_id, remote_path, local_path
        )
        return return_api(result, code=201)

    elif request.method == "DELETE":
        remote_mapping.delete()
        return return_api({})


# =====================
# Library Import
# =====================


@api.route("/libraryimport", methods=["GET", "POST"])
@error_handler
@auth
def api_library_import() -> ApiReturn | None:
    if request.method == "GET":
        included_folders = extract_key(
            request, "included_folders", check_existence=False
        )
        excluded_folders = extract_key(
            request, "excluded_folders", check_existence=False
        )
        limit = extract_key(request, "limit", check_existence=False)
        only_english = extract_key(
            request, "only_english", check_existence=False
        )
        limit_parent_folder = extract_key(
            request, "limit_parent_folder", check_existence=False
        )
        result = propose_library_import(
            included_folders_str=included_folders,
            excluded_folders_str=excluded_folders,
            limit=limit,
            limit_parent_folder=limit_parent_folder,
            only_english=only_english,
        )
        return return_api(result)

    elif request.method == "POST":
        data = request.get_json()
        rename_files = extract_key(request, "rename_files", False)

        if not isinstance(data, list) or not all(
            isinstance(e, dict) and "filepath" in e and "id" in e for e in data
        ):
            raise InvalidKeyValue

        import_library(data, rename_files)
        return return_api({}, code=201)


# =====================
# Library + Volumes
# =====================


@api.route("/volumes/search", methods=["GET", "POST"])
@error_handler
@auth
def api_volumes_search() -> ApiReturn | None:
    if request.method == "GET":
        query = extract_key(request, "query")
        search_results = run(ComicVine().search_volumes(query))
        for r in search_results:
            del r["cover"]  # pyright: ignore
        return return_api(search_results)

    elif request.method == "POST":
        data: dict[str, Any] = request.get_json()
        for key in (
            "comicvine_id",
            "title",
            "year",
            "volume_number",
            "publisher",
        ):
            if key not in data:
                raise KeyNotFound(key)

        vd = VolumeData(
            id=0,
            comicvine_id=data["comicvine_id"],
            libgen_series_id=None
            if "libgen_series_id" not in data
            else data["libgen_series_id"],
            title=data["title"],
            alt_title=data["title"],
            year=data["year"],
            publisher=data["publisher"],
            volume_number=data["volume_number"],
            description="",
            site_url="",
            monitored=True,
            monitor_new_issues=True,
            root_folder=1,
            folder="",
            custom_folder=False,
            special_version=SpecialVersion(data.get("special_version")),
            special_version_locked=False,
            last_cv_fetch=0,
        )

        folder = generate_volume_folder_name(vd)
        return return_api({"folder": folder})


@api.route("/volumes", methods=["GET", "POST"])
@error_handler
@auth
def api_volumes() -> ApiReturn | None:
    if request.method == "GET":
        query = extract_key(request, "query", False)
        sort = extract_key(request, "sort", False)
        filter = extract_key(request, "filter", False)
        if query:
            volumes = library.search(query, sort, filter)
        else:
            volumes = library.get_public_volumes(sort, filter)

        return return_api(volumes)

    elif request.method == "POST":
        data: dict = request.get_json()

        comicvine_id = data.get("comicvine_id")
        if comicvine_id is None:
            raise KeyNotFound("comicvine_id")

        root_folder_id = data.get("root_folder_id")
        if root_folder_id is None:
            raise KeyNotFound("root_folder_id")

        monitor = data.get("monitor", True)
        if not isinstance(monitor, bool):
            raise InvalidKeyValue("monitor", monitor)

        monitoring_scheme = data.get("monitoring_scheme") or "all"
        try:
            monitoring_scheme = MonitorScheme(monitoring_scheme)
        except ValueError:
            raise InvalidKeyValue("monitoring_scheme", monitoring_scheme)

        monitor_new_issues = data.get("monitor_new_issues", True)
        if not isinstance(monitor_new_issues, bool):
            raise InvalidKeyValue("monitor_new_issues", monitor_new_issues)

        volume_folder = data.get("volume_folder") or None

        auto_search = data.get("auto_search", True)
        if not isinstance(auto_search, bool):
            raise InvalidKeyValue("auto_search", auto_search)

        special_version = data.get("special_version") or None
        if special_version == "auto":
            sv = None
        else:
            try:
                sv = SpecialVersion(special_version)
            except ValueError:
                raise InvalidKeyValue("special_version", special_version)

        volume_id = library.add(
            comicvine_id,
            root_folder_id,
            monitor,
            monitoring_scheme,
            monitor_new_issues,
            volume_folder,
            sv,
            auto_search,
        )
        volume_info = library.get_volume(volume_id).get_public_keys()
        return return_api(volume_info, code=201)


@api.route("/volumes/stats", methods=["GET"])
@error_handler
@auth
def api_volumes_stats() -> ApiReturn:
    result = library.get_stats()
    return return_api(result)


@api.route("/volumes/<int:id>", methods=["GET", "PUT", "DELETE"])
@error_handler
@auth
def api_volume(id: int) -> ApiReturn | None:
    volume = library.get_volume(id)

    if request.method == "GET":
        volume_info = volume.get_public_keys()
        return return_api(volume_info)

    elif request.method == "PUT":
        edit_info: dict[str, Any] = request.get_json()

        if "root_folder" in edit_info:
            volume.change_root_folder(edit_info["root_folder"])

        if "volume_folder" in edit_info:
            volume.change_volume_folder(edit_info["volume_folder"])

        if "monitoring_scheme" in edit_info:
            try:
                monitoring_scheme = MonitorScheme(
                    edit_info["monitoring_scheme"]
                )

            except ValueError:
                raise InvalidKeyValue(
                    "monitoring_scheme", edit_info["monitoring_scheme"]
                )

            volume.apply_monitor_scheme(monitoring_scheme)

        volume.update(
            {
                k: v
                for k, v in edit_info.items()
                if k
                not in (
                    "root_folder",
                    "volume_folder",
                    "monitoring_scheme",
                    "called_from",
                )
            },
            False,
            edit_info.get("called_from", ""),
        )
        return return_api(None)

    elif request.method == "DELETE":
        delete_folder = extract_key(request, "delete_folder")
        volume.delete(delete_folder=delete_folder)
        return return_api({})


@api.route("/volumes/<int:id>/cover", methods=["GET"])
@error_handler
@auth
def api_volume_cover(id: int) -> tuple[Response, int]:
    cover = library.get_volume(id).get_cover()
    return send_file(cover, mimetype="image/jpeg"), 200


@api.route("/issues/<int:id>/thumbnails", methods=["GET"])
@error_handler
@auth
def api_issue_thumbnails(id: int) -> ApiReturn:
    filepath = extract_key(request, "filepath", False)
    thumbnails = get_issue_page_thumbnails(id, filepath)

    return return_api(thumbnails)


@api.route("/thumbnail", methods=["GET"])
@error_handler
@auth
def api_issue_thumbnail() -> tuple[Response, int]:
    filepath = extract_key(request, "filepath", False)
    thumbnail = get_issue_page_thumbnail(filepath)

    return send_file(thumbnail, mimetype="image/jpeg"), 200


@api.route("/issues/<int:id>", methods=["GET", "PUT"])
@error_handler
@auth
def api_issues(id: int) -> ApiReturn | None:
    issue = library.get_issue(id)

    if request.method == "GET":
        result = issue.get_data()
        return return_api(result)

    elif request.method == "PUT":
        edit_info: dict = request.get_json()
        monitored = edit_info.get("monitored")
        if monitored is not None:
            issue.update(
                {"monitored": bool(monitored)}, edit_info.get("called_from", "")
            )

        result = issue.get_data()
        return return_api(result)


# =====================
# Renaming
# =====================


@api.route("/volumes/<int:id>/rename", methods=["GET"])
@error_handler
@auth
def api_rename(id: int) -> ApiReturn:
    library.get_volume(id)
    result = preview_mass_rename(id, is_for_api=True)[0]
    return return_api(result)


@api.route("/issues/<int:id>/rename", methods=["GET"])
@error_handler
@auth
def api_rename_issue(id: int) -> ApiReturn:
    volume_id = library.get_issue(id).get_data().volume_id
    result = preview_mass_rename(volume_id, id, is_for_api=True)[0]
    return return_api(result)


# =====================
# File Conversion
# =====================


@api.route("/volumes/<int:id>/convert", methods=["GET"])
@error_handler
@auth
def api_convert(id: int) -> ApiReturn:
    library.get_volume(id)
    result = preview_mass_convert(id, is_for_api=True)
    return return_api(result)


@api.route("/issues/<int:id>/convert", methods=["GET"])
@error_handler
@auth
def api_convert_issue(id: int) -> ApiReturn:
    volume_id = library.get_issue(id).get_data().volume_id
    result = preview_mass_convert(volume_id, id, is_for_api=True)
    return return_api(result)


# =====================
# Manual search + Download
# =====================


@api.route("/volumes/<int:id>/manualsearch", methods=["GET", "POST"])
@error_handler
@auth
def api_volume_manual_search(id: int) -> ApiReturn | None:
    library.get_volume(id)

    if request.method == "GET":
        result = manual_search(id)
        return return_api(result)

    if request.method == "POST":
        result = manual_search(id, None, extract_key(request, "url"))
        return return_api(result)


@api.route("/volumes/<int:id>/download", methods=["POST"])
@error_handler
@auth
def api_volume_download(id: int) -> ApiReturn:
    library.get_volume(id)
    result_key: SearchResultData = extract_key(request, "result")
    force_match: bool = extract_key(request, "force_match")
    result = run(DownloadHandler().add(result_key, id, force_match=force_match))
    return return_api(
        {
            "result": (result or (None,))[0],
            "fail_reason": result[1].value if result[1] else result[1],
        },
        code=201,
    )


@api.route("/issues/<int:id>/manualsearch", methods=["GET", "POST"])
@error_handler
@auth
def api_issue_manual_search(id: int) -> ApiReturn | None:
    volume_id = library.get_issue(id).get_data().volume_id

    if request.method == "GET":
        result = manual_search(volume_id, id)
        return return_api(result)

    if request.method == "POST":
        result = manual_search(volume_id, id, extract_key(request, "url"))
        return return_api(result)


@api.route("/issues/<int:id>/download", methods=["POST"])
@error_handler
@auth
def api_issue_download(id: int) -> ApiReturn:
    volume_id = library.get_issue(id).get_data().volume_id
    result_key: SearchResultData = extract_key(request, "result")
    force_match: bool = extract_key(request, "force_match")
    result = run(
        DownloadHandler().add(
            result_key, volume_id, id, force_match=force_match
        )
    )
    return return_api(
        {
            "result": result[0],
            "fail_reason": result[1].value if result[1] else result[1],
        },
        code=201,
    )


@api.route("/activity/queue", methods=["GET", "DELETE"])
@error_handler
@auth
def api_downloads() -> ApiReturn | None:
    download_handler = DownloadHandler()

    if request.method == "GET":
        result = download_handler.get_all()
        return return_api(result)

    elif request.method == "DELETE":
        download_handler.remove_all()
        return return_api({})


@api.route(
    "/activity/queue/<int:download_id>", methods=["GET", "PUT", "DELETE"]
)
@error_handler
@auth
def api_delete_download(download_id: int) -> ApiReturn | None:
    download_handler = DownloadHandler()

    if request.method == "GET":
        result = download_handler.get_one(download_id).as_dict()
        return return_api(result)

    elif request.method == "PUT":
        index: int = extract_key(request, "index")
        download_handler.set_queue_location(download_id, index)
        return return_api({})

    elif request.method == "DELETE":
        data: dict[str, Any] = request.get_json(silent=True) or {}
        blocklist = data.get("blocklist", False)
        if not isinstance(blocklist, bool):
            raise InvalidKeyValue("blocklist", blocklist)

        download_handler.remove(download_id, blocklist)
        return return_api({})


@api.route("/activity/history", methods=["GET", "DELETE"])
@error_handler
@auth
def api_download_history() -> ApiReturn | None:
    if request.method == "GET":
        volume_id: int = extract_key(request, "volume_id", False)
        issue_id: int = extract_key(request, "issue_id", False)
        offset: int = extract_key(request, "offset", False)
        history = get_download_history(volume_id, issue_id, offset)
        total_records = get_download_history_total_records(volume_id, issue_id)
        return return_api(
            {
                "history": history,
                "total_records": total_records,
            }
        )

    elif request.method == "DELETE":
        delete_download_history()
        return return_api({})


@api.route("/activity/folder", methods=["DELETE"])
@error_handler
@auth
def api_empty_download_folder() -> ApiReturn:
    DownloadHandler().empty_download_folder()
    return return_api({})


# =====================
# Blocklist
# =====================


@api.route("/blocklist", methods=["GET", "POST", "DELETE"])
@error_handler
@auth
def api_blocklist() -> ApiReturn | None:
    if request.method == "GET":
        offset = extract_key(request, "offset", False)

        blocklist = get_blocklist(offset)
        total_records = get_blocklist_total_records()
        return return_api(
            {
                "blocklist": [b.todict() for b in blocklist],
                "total_records": total_records,
            }
        )

    elif request.method == "POST":
        data = request.get_json()
        if not isinstance(data, dict):
            raise InvalidKeyValue(value=data)

        web_link = data.get("web_link")
        if not (web_link and isinstance(web_link, str)):
            raise InvalidKeyValue("web_link", web_link)

        web_title = data.get("web_title")
        if not (web_title is None or web_title and isinstance(web_title, str)):
            raise InvalidKeyValue("web_title", web_title)

        web_sub_title = data.get("web_sub_title")
        if not (
            web_sub_title is None
            or web_sub_title
            and isinstance(web_sub_title, str)
        ):
            raise InvalidKeyValue("web_sub_title", web_sub_title)

        download_link = data.get("download_link")
        if not (
            download_link is None
            or download_link
            and isinstance(download_link, str)
        ):
            raise InvalidKeyValue("download_link", download_link)

        source = data.get("source")
        if not (source is None or source and isinstance(source, str)):
            raise InvalidKeyValue("source", source)

        if not data.get("source"):
            source = None
        else:
            try:
                source = DownloadSource(data["source"])
            except ValueError:
                raise InvalidKeyValue("source", data["source"])

        volume_id = data.get("volume_id")
        if not (volume_id and isinstance(volume_id, int)):
            raise InvalidKeyValue("volume_id", volume_id)

        issue_id = data.get("issue_id")
        if not (issue_id is None or issue_id and isinstance(issue_id, int)):
            raise InvalidKeyValue("issue_id", issue_id)

        try:
            reason = BlocklistReason[
                BlocklistReasonID(data.get("reason_id")).name
            ]

        except ValueError:
            raise InvalidKeyValue("reason_id", data.get("reason_id"))

        result = add_to_blocklist(
            web_link=web_link,
            web_title=web_title,
            web_sub_title=web_sub_title,
            download_link=download_link,
            source=source,
            volume_id=volume_id,
            issue_id=issue_id,
            reason=reason,
        ).todict()
        return return_api(result, code=201)

    elif request.method == "DELETE":
        delete_blocklist()
        return return_api({})


@api.route("/blocklist/<int:id>", methods=["GET", "DELETE"])
@error_handler
@auth
def api_blocklist_entry(id: int) -> ApiReturn | None:
    if request.method == "GET":
        result = get_blocklist_entry(id).todict()
        return return_api(result)

    elif request.method == "DELETE":
        delete_blocklist_entry(id)
        return return_api({})


# =====================
# Credentials
# =====================
@api.route("/credentials", methods=["GET", "POST"])
@error_handler
@auth
def api_credentials() -> ApiReturn | None:
    cred = Credentials()

    if request.method == "GET":
        result_get = [c.todict() for c in cred.get_all()]
        return return_api(result_get)

    elif request.method == "POST":
        data = request.get_json()
        if not isinstance(data, dict):
            raise InvalidKeyValue(value=data)

        if "source" not in data:
            raise KeyNotFound("source")

        try:
            source = CredentialSource(data["source"])

        except ValueError:
            raise InvalidKeyValue("source", data["source"])

        result = cred.add(
            CredentialData(
                id=-1,
                source=source,
                username=data.get("username"),
                email=data.get("email"),
                password=data.get("password"),
                api_key=data.get("api_key"),
            )
        )
        return return_api(result.todict(), code=201)


@api.route("/credentials/<int:id>", methods=["GET", "DELETE"])
@error_handler
@auth
def api_credential(id: int) -> ApiReturn | None:
    cred = Credentials()
    if request.method == "GET":
        result = cred.get_one(id).todict()
        return return_api(result)

    elif request.method == "DELETE":
        cred.delete(id)
        return return_api({})


# =====================
# Torrent Clients
# =====================
@api.route("/externalclients", methods=["GET", "POST"])
@error_handler
@auth
def api_external_clients() -> ApiReturn | None:
    if request.method == "GET":
        result_list = ExternalClients.get_clients()
        return return_api(result_list)

    elif request.method == "POST":
        json_data: dict = request.get_json()
        data = {
            k: json_data.get(k)
            for k in (
                "client_type",
                "title",
                "base_url",
                "username",
                "password",
                "api_token",
            )
        }
        result = ExternalClients.add(**data).get_client_data()
        return return_api(result, code=201)


@api.route("/externalclients/options", methods=["GET"])
@error_handler
@auth
def api_external_clients_keys() -> ApiReturn:
    result = {
        k: v.required_tokens
        for k, v in ExternalClients.get_client_types().items()
    }
    return return_api(result)


@api.route("/externalclients/test", methods=["POST"])
@error_handler
@auth
def api_external_clients_test() -> ApiReturn:
    data: dict = request.get_json()
    data = {
        k: data.get(k)
        for k in (
            "client_type",
            "base_url",
            "username",
            "password",
            "api_token",
        )
    }
    result = ExternalClients.test(**data)
    return return_api(result)


@api.route("/externalclients/<int:id>", methods=["GET", "PUT", "DELETE"])
@error_handler
@auth
def api_external_client(id: int) -> ApiReturn | None:
    client = ExternalClients.get_client(id)

    if request.method == "GET":
        result = client.get_client_data()
        return return_api(result)

    elif request.method == "PUT":
        data: dict = request.get_json()
        data = {
            k: data.get(k)
            for k in ("title", "base_url", "username", "password", "api_token")
        }
        client.update_client(data)
        return return_api(client.get_client_data())

    elif request.method == "DELETE":
        client.delete_client()
        return return_api({})


# =====================
# Mass Editor
# =====================
@api.route("/masseditor", methods=["POST"])
@error_handler
@auth
def api_mass_editor() -> ApiReturn:
    data = request.get_json()
    if not isinstance(data, dict):
        raise InvalidKeyValue("body", data)
    if "action" not in data:
        raise KeyNotFound("action")
    if "volume_ids" not in data:
        raise KeyNotFound("volume_ids")

    action: str = data["action"]
    volume_ids: list[int] | Any = data["volume_ids"]
    args: dict[str, Any] = data.get("args", {})

    if not (
        isinstance(volume_ids, list)
        and all(isinstance(v, int) for v in volume_ids)
    ):
        raise InvalidKeyValue("volume_ids", volume_ids)

    if not isinstance(args, dict):
        raise InvalidKeyValue("args", args)

    run_mass_editor_action(action, volume_ids, **args)
    return return_api({})


# =====================
# Files
# =====================
@api.route("/files/<int:f_id>", methods=["GET", "POST", "PUT", "DELETE"])
@error_handler
@auth
def api_files(f_id: int) -> ApiReturn | None:
    if request.method == "GET":
        result = FilesDB.fetch(file_id=f_id)[0]
        return return_api(result)

    elif request.method == "POST":
        new_pages: list[ThumbnailData] = request.get_json()
        update_issue_pages(f_id, new_pages)
        return return_api({})

    elif request.method == "PUT":
        edit_info: dict[str, Any] = request.get_json()
        FilesDB.update(file_id=f_id, data={k: v for k, v in edit_info.items()})
        return return_api({})

    elif request.method == "DELETE":
        delete_issue_file(f_id)
        return return_api({})
