from io import BytesIO
from json import dumps
from typing import Any

from backend.internals.server import SERVER
from flask import Blueprint, redirect, render_template, send_file
from werkzeug.wrappers.response import Response

ui = Blueprint("ui", __name__)
methods = ["GET"]


def render(filename: str, **kwargs: Any) -> str:
    return render_template(filename, url_base=SERVER.url_base, **kwargs)


@ui.route("/manifest.json", methods=methods)
def ui_manifest():
    return send_file(
        BytesIO(
            dumps(
                {
                    "name": "Kapowarr",
                    "short_name": "Kapowarr",
                    "description": "Kapowarr is a software to build and manage a comic book library, fitting in the *arr suite of software.",
                    "display": "standalone",
                    "orientation": "portrait-primary",
                    "start_url": f"{SERVER.url_base}/",
                    "scope": f"{SERVER.url_base}/",
                    "id": f"{SERVER.url_base}/",
                    "background_color": "#464b51",
                    "theme_color": "#ebc700",
                    "icons": [
                        {
                            "src": f"{SERVER.url_base}/static/img/favicon.svg",
                            "type": "image/svg+xml",
                            "sizes": "any",
                        }
                    ],
                },
                indent=4,
            ).encode("utf-8")
        ),
        mimetype="application/manifest+json",
        download_name="manifest.json",
    ), 200


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


@ui.route("/volumes/<_id>", methods=methods)
def ui_view_volume(_id: str) -> str:
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


@ui.route("/react", methods=methods)
def ui_react() -> str:
    return render("react.html")
