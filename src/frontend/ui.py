from io import BytesIO
from json import dumps
from typing import Any

from flask import Blueprint, render_template, send_file

from backend.internals.server import SERVER
from backend.internals.settings import about_data

ui = Blueprint("ui", __name__)
methods = ["GET"]


def render(filename: str, **kwargs: Any) -> str:
    return render_template(
        filename, url_base=SERVER.url_base, version=about_data["version"], **kwargs
    )


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


@ui.route("/", defaults={"_path": ""})
@ui.route("/<path:_path>")
def ui_react(_path: str) -> str:
    return render("react.html")
