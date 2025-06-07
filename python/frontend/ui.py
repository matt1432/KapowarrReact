from typing import Any

from backend.internals.server import SERVER
from flask import Blueprint, redirect, render_template
from werkzeug.wrappers.response import Response

ui = Blueprint("ui", __name__)
methods = ["GET"]


def render(filename: str, **kwargs: Any) -> str:
    return render_template(filename, url_base=SERVER.url_base, **kwargs)


@ui.route("/login", methods=methods)
def ui_login() -> str:
    return render("login.html")


@ui.route("/", methods=methods)
def ui_volumes() -> str:
    return render("volumes.html")


@ui.route("/add", methods=methods)
def ui_add_volume() -> str:
    return render("add_volume.html")


@ui.route("/library-import", methods=methods)
def ui_library_import() -> str:
    return render("library_import.html")


@ui.route("/volumes/<id>", methods=methods)
def ui_view_volume(id: str) -> str:
    return render("view_volume.html")


@ui.route("/activity/queue", methods=methods)
def ui_queue() -> str:
    return render("queue.html")


@ui.route("/activity/history", methods=methods)
def ui_history() -> str:
    return render("history.html")


@ui.route("/activity/blocklist", methods=methods)
def ui_blocklist() -> str:
    return render("blocklist.html")


@ui.route("/system/status", methods=methods)
def ui_status() -> str:
    return render("status.html")


@ui.route("/system/tasks", methods=methods)
def ui_tasks() -> str:
    return render("tasks.html")


@ui.route("/settings", methods=methods)
def ui_settings() -> Response:
    return redirect(f"{SERVER.url_base}/settings/mediamanagement")


@ui.route("/settings/mediamanagement", methods=methods)
def ui_mediamanagement() -> str:
    return render("settings_mediamanagement.html")


@ui.route("/settings/download", methods=methods)
def ui_download() -> str:
    return render("settings_download.html")


@ui.route("/settings/downloadclients", methods=methods)
def ui_download_clients() -> str:
    return render("settings_download_clients.html")


@ui.route("/settings/general", methods=methods)
def ui_general() -> str:
    return render("settings_general.html")
