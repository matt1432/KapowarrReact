from io import BytesIO
from os import listdir
from os.path import dirname, exists, join, splitext
from zipfile import ZipFile

from PIL import Image

from backend.base.definitions import Constants, FileConstants, ThumbnailData
from backend.base.files import (
    create_folder,
    delete_file_folder,
    folder_path,
    generate_archive_folder,
    list_files,
)
from backend.base.logging import LOGGER
from backend.implementations.ad_removal import get_files_prefix
from backend.implementations.converters import cbr_to_cbz, cbz_to_cbr
from backend.implementations.volumes import Volume
from backend.internals.db import DBConnection
from backend.internals.db_models import FilesDB


def _extract_files(file: str) -> list[str]:
    """Extract all the files inside a CBR or CBZ file that has a corresponding volume.
    Only return itself in the list if it has no volume.

    Args:
        file (str): the archive to extract the files from

    Returns:
        list[str]: the file paths that were extracted
    """
    volume_id = FilesDB.volume_of_file(file)

    if not volume_id:
        # File not matched to volume
        return [file]

    volume_folder = Volume(volume_id).vd.folder
    archive_folder = generate_archive_folder(volume_folder, file)

    is_rar = file.endswith(".cbr")
    if is_rar:
        cbr_to_cbz(file)
        file = file.replace(".cbr", ".cbz")

    with ZipFile(file, "r") as zip:
        zip.extractall(archive_folder)

    resulting_files = (
        list_files(archive_folder) if exists(archive_folder) else []
    )

    if is_rar:
        cbz_to_cbr(file)

    return resulting_files


def _get_main_thumbnails_folder() -> str:
    """Get the path to the folder containing all the thumbnails
    The thumbnails are saved in the same place as the Kapowarr db

    Returns:
        str: the path
    """
    return join(
        dirname(DBConnection.file) or folder_path(*Constants.DB_FOLDER),
        Constants.THUMBNAILS_FOLDER_NAME,
    )


def _get_thumbnails_folder(
    issue_id: int,
    file_path: str,
) -> str:
    """Get the folder that contains the thumbnails of a given file

    Args:
        issue_id (int): the ID of the file's corresponding issue

        file_path (str): the path of the given file

    Returns:
        str: the path
    """
    volume_id = FilesDB.volume_of_file(file_path)
    file_id = FilesDB.fetch(filepath=file_path)[0]["id"]

    return join(
        _get_main_thumbnails_folder(),
        str(volume_id),
        str(issue_id),
        str(file_id),
    )


def delete_thumbnails() -> None:
    """Delete all thumbnails"""
    for _folder in listdir(_get_main_thumbnails_folder()):
        folder = join(_get_main_thumbnails_folder(), _folder)
        LOGGER.info(f"Deleting {folder}")
        delete_file_folder(folder)


def _generate_thumbnail(
    file_path: str,
    folder: str,
    archive_folder: str,
) -> str:
    """From the page of a book, create a thumbnail that is 600 pixels high

    Args:
        file_path (str): the path to the page image file

        folder (str): the folder in which we will place the thumbnail

        archive_folder (str): the folder where the pages were extracted

    Returns:
        str: the path of the resulting thumbnail
    """
    img = Image.open(file_path)

    # We want to set the height of each page to 600
    new_size_ratio = 600.0 / float(img.size[1])

    if new_size_ratio != 1.0:
        img = img.resize(
            (
                int(img.size[0] * new_size_ratio),
                int(img.size[1] * new_size_ratio),
            ),
            Image.Resampling.LANCZOS,
        )

    new_filename = file_path.replace(archive_folder, folder)
    create_folder(dirname(new_filename))

    try:
        img.save(new_filename, optimize=True)
    except OSError:
        img = img.convert("RGB")
        img.save(new_filename, optimize=True)

    return new_filename


def _generate_page_thumbnails(
    thumbnails_folder: str,
    file_path: str,
) -> list[str]:
    """Generates a thumbnail of every page inside a book and returns
    a list of their corresponding file names

    Args:
        thumbnails_folder (str): the path of the file's thumbnails

        file_path (str): the path of the given file

    Returns:
        list[str]: the path of all the generated thumbnails
    """
    volume_id = FilesDB.volume_of_file(file_path)

    extension = splitext(file_path)[1].lower()

    if not volume_id or extension not in (".cbr", ".cbz"):
        return []

    original_pages = _extract_files(file_path)

    delete_file_folder(thumbnails_folder)

    create_folder(thumbnails_folder)

    volume_folder = Volume(volume_id).vd.folder
    archive_folder = generate_archive_folder(volume_folder, file_path)

    new_pages: list[str] = []

    for page in original_pages:
        if page.endswith(FileConstants.IMAGE_EXTENSIONS):
            new_pages.append(_generate_thumbnail(page, thumbnails_folder, archive_folder))

    delete_file_folder(archive_folder)

    return new_pages


def _get_thumbnails_data(
    thumbnails_folder: str,
    thumbnails: list[str],
) -> list[ThumbnailData]:
    """Add additional data to each thumbnail path for the frontend

    Args:
        thumbnails_folder (str): the path of the file's thumbnails

        thumbnails (list[str]): list of paths of the thumbnails

    Returns:
        list[ThumbnailData]: the data of each thumbnail
    """
    if len(thumbnails) == 0:
        return []

    thumbnails_data: list[ThumbnailData] = []

    filenames = [thumbnail.replace(thumbnails_folder, "")[1:] for thumbnail in thumbnails]
    prefix = get_files_prefix(filenames)
    folder_name = dirname(filenames[0])

    for thumbnail, filename in zip(thumbnails, filenames):
        thumbnails_data.append(
            ThumbnailData(
                folder_name=folder_name,
                full_path=thumbnail,
                prefix=prefix,
                current_filename=filename,
                new_filename=filename,
            )
        )

    return thumbnails_data


def get_issue_page_thumbnails(
    issue_id: int,
    file_path: str,
    refresh=False,
) -> list[ThumbnailData]:
    """Generate and get info for thumbnails of pages of a book

    Args:
        issue_id (int): the ID of the file's corresponding issue

        file_path (str): the path of the given file

        refresh (bool, optional): Whether or not to delete already existing thumbnails.
            Defaults to False.

    Returns:
        list[ThumbnailData]: the data of each thumbnail
    """
    thumbnails_folder = _get_thumbnails_folder(issue_id, file_path)

    if refresh or not exists(thumbnails_folder):
        return _get_thumbnails_data(
            thumbnails_folder,
            _generate_page_thumbnails(thumbnails_folder, file_path),
        )

    return _get_thumbnails_data(
        thumbnails_folder, list_files(thumbnails_folder)
    )


def get_issue_page_thumbnail(page: str) -> BytesIO:
    """Get bytes of a page for exposing it to the frontend

    Args:
        page (str): the path of the page

    Returns:
        BytesIO: the data of the page
    """
    with open(page, "rb") as fh:
        buf = BytesIO(fh.read())
    return buf


def update_issue_pages(file_id: int, new_pages: list[ThumbnailData]) -> None:
    """Modify the contents of a CBR or CBZ file with the provided list of thumbnail data.

    Args:
        file_id (int): the ID of the file we want to update

        new_pages (list[ThumbnailData]): the modified list of thumbnail data
    """
    if len(new_pages) == 0:
        return

    file = FilesDB.fetch(file_id=file_id)[0]["filepath"]

    is_rar = file.endswith(".cbr")

    if not file.endswith(".cbz") and not is_rar:
        return

    if is_rar:
        cbr_to_cbz(file)
        file = file.replace(".cbr", ".cbz")

    archive_folder = generate_archive_folder(dirname(file), file)

    with ZipFile(file, "r") as zip:
        files = zip.namelist()
        zip.extractall(archive_folder)

    with ZipFile(file, "w") as zip:
        for f in files:
            if not f.endswith(FileConstants.IMAGE_EXTENSIONS):
                zip.write(filename=join(archive_folder, f), arcname=f)

            for page in new_pages:
                if f == page["current_filename"]:
                    zip.write(
                        filename=join(archive_folder, f),
                        arcname=page["new_filename"],
                    )
                    break

    delete_file_folder(archive_folder)
    delete_file_folder(new_pages[0]["folder_name"])

    if is_rar:
        cbz_to_cbr(file)
    return
