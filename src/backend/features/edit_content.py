from concurrent.futures import ThreadPoolExecutor
from glob import escape, glob
from io import BytesIO
from os import listdir
from os.path import dirname, exists, join, splitext
from typing import IO
from zipfile import ZipFile

from PIL import Image

from backend.base.custom_exceptions import FileNotFound
from backend.base.definitions import (
    Constants,
    FileConstants,
    PageReference,
    SimilarPageData,
    ThumbnailData,
)
from backend.base.files import (
    create_folder,
    delete_file_folder,
    folder_path,
    generate_archive_folder,
    list_files,
)
from backend.base.logging import LOGGER
from backend.implementations.ad_removal import (
    get_files_prefix,
    remove_files_from_archive,
)
from backend.implementations.converters import cbr_to_cbz, cbz_to_cbr
from backend.implementations.image_comparison import (
    DEFAULT_SIMILARITY_THRESHOLD,
    find_similar_images,
    hash_image,
    open_archive_images,
)
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
        dirname(DBConnection.default_file) or folder_path(*Constants.DB_FOLDER),
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


def _save_thumbnail(image: str | IO[bytes], target: str) -> None:
    """Save a copy of an image that is 600 pixels high

    Args:
        image (str | IO[bytes]): the image to create the thumbnail of

        target (str): the path to save the thumbnail at
    """
    img = Image.open(image)

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

    create_folder(dirname(target))

    try:
        img.save(target, optimize=True)
    except OSError:
        img = img.convert("RGB")
        img.save(target, optimize=True)


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
    new_filename = file_path.replace(archive_folder, folder)
    _save_thumbnail(file_path, new_filename)
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
            new_pages.append(
                _generate_thumbnail(page, thumbnails_folder, archive_folder)
            )

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

    filenames = [
        thumbnail.replace(thumbnails_folder, "")[1:] for thumbnail in thumbnails
    ]
    prefix = get_files_prefix(filenames)

    for thumbnail, filename in zip(thumbnails, filenames):
        thumbnails_data.append(
            ThumbnailData(
                folder_name=thumbnails_folder,
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


# region Similar pages
def _get_similar_pages_folder() -> str:
    """Get the folder that contains the previews of the similar pages

    Returns:
        str: the path
    """
    return join(_get_main_thumbnails_folder(), "similar_pages")


def _delete_file_thumbnails(volume_id: int, file_id: int) -> None:
    """Delete the cached page thumbnails of a file, so that they are
    regenerated next time

    Args:
        volume_id (int): the ID of the volume of the file

        file_id (int): the ID of the file
    """
    for folder in glob(
        join(
            escape(_get_main_thumbnails_folder()),
            str(volume_id),
            "*",
            str(file_id),
        )
    ):
        delete_file_folder(folder)


def _find_similar_pages_in_file(
    reference: int,
    file_id: int,
    filepath: str,
    volume_folder: str,
    threshold: float,
) -> list[SimilarPageData]:
    """Find the pages in a book that look like the reference page, and
    generate a preview of each of them

    Args:
        reference (int): the hash of the reference page

        file_id (int): the ID of the book

        filepath (str): the path of the book

        volume_folder (str): the folder of the volume of the book

        threshold (float): the maximum distance between hashes

    Returns:
        list[SimilarPageData]: the similar pages
    """
    result: list[SimilarPageData] = []

    with open_archive_images(filepath, volume_folder) as images:
        matches = find_similar_images(reference, images, threshold)

        for filename, distance in sorted(matches.items()):
            preview = join(
                _get_similar_pages_folder(), str(file_id), *filename.split("/")
            )
            try:
                with images[filename]() as fh:
                    _save_thumbnail(fh, preview)
            except OSError:
                LOGGER.exception(f"Failed to create preview of {filename}")
                continue

            result.append(
                SimilarPageData(
                    file_id=file_id,
                    filename=filename,
                    filepath=filepath,
                    distance=distance,
                    preview_path=preview,
                )
            )

    return result


def find_similar_pages(
    file_id: int,
    filename: str,
    threshold: float = DEFAULT_SIMILARITY_THRESHOLD,
) -> list[SimilarPageData]:
    """Find all pages, in all books of the volume, that look like a given page

    Args:
        file_id (int): the ID of the book containing the reference page

        filename (str): the name of the reference page inside the book

        threshold (float, optional): the maximum fraction of differing bits
            between the hashes of two pages for them to be similar.
            Defaults to DEFAULT_SIMILARITY_THRESHOLD.

    Raises:
        FileNotFound: the book or the page doesn't exist

    Returns:
        list[SimilarPageData]: the similar pages, including the reference page
    """
    filepath = FilesDB.fetch(file_id=file_id)[0]["filepath"]
    volume_id = FilesDB.volume_of_file(filepath)
    if not volume_id:
        raise FileNotFound(filepath)

    volume_folder = Volume(volume_id).vd.folder

    with open_archive_images(filepath, volume_folder) as images:
        if filename not in images:
            raise FileNotFound(f"{filepath}/{filename}")

        with images[filename]() as fh:
            reference = hash_image(fh)

    if reference is None:
        raise FileNotFound(f"{filepath}/{filename}")

    delete_file_folder(_get_similar_pages_folder())

    books = [
        f
        for f in FilesDB.fetch(volume_id=volume_id)
        if splitext(f["filepath"])[1].lower() in (".cbr", ".cbz")
    ]

    LOGGER.info(
        f"Searching {len(books)} books for pages similar to {filename} "
        f"of {filepath}"
    )

    with ThreadPoolExecutor() as executor:
        results = executor.map(
            lambda f: _find_similar_pages_in_file(
                reference, f["id"], f["filepath"], volume_folder, threshold
            ),
            books,
        )
        return [page for pages in results for page in pages]


def delete_pages(pages: list[PageReference]) -> None:
    """Delete pages from books

    Args:
        pages (list[PageReference]): the pages to delete
    """
    filenames_per_file: dict[int, set[str]] = {}
    for page in pages:
        filenames_per_file.setdefault(page["file_id"], set()).add(
            page["filename"]
        )

    for file_id, filenames in filenames_per_file.items():
        filepath = FilesDB.fetch(file_id=file_id)[0]["filepath"]
        LOGGER.info(f"Deleting pages {sorted(filenames)} from {filepath}")
        remove_files_from_archive(filepath, filenames)

        volume_id = FilesDB.volume_of_file(filepath)
        if volume_id:
            _delete_file_thumbnails(volume_id, file_id)

    delete_file_folder(_get_similar_pages_folder())
