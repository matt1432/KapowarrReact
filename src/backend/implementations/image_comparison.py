"""
Perceptual hashing of images, used to find pages that look alike, even when
they were re-encoded, resized or slightly altered.
"""

from collections.abc import Callable, Generator
from contextlib import contextmanager
from functools import partial
from os.path import relpath
from typing import IO
from zipfile import ZipFile

from PIL import Image, UnidentifiedImageError

from backend.base.definitions import FileConstants
from backend.base.files import (
    create_folder,
    delete_file_folder,
    generate_archive_folder,
    list_files,
)
from backend.base.helpers import run_rar, try_rar
from backend.base.logging import LOGGER

HASH_SIZE = 16
"The hash is HASH_SIZE * HASH_SIZE bits long"

DEFAULT_SIMILARITY_THRESHOLD = 0.1
"""The maximum fraction of differing bits for two images to be considered
similar"""

ImageOpener = Callable[[], IO[bytes]]
"Opens an image for reading. Can be called multiple times."


def hash_image(image: str | IO[bytes]) -> int | None:
    """Calculate the difference hash (dHash) of an image. Images that look alike
    have hashes that differ in few bits, regardless of their resolution or
    compression.

    Args:
        image (str | IO[bytes]): The path to the image or a file-like object.

    Returns:
        int | None: The hash, or None if the image could not be read.
    """
    try:
        with Image.open(image) as img:
            # Lets the JPEG decoder downscale while decoding, which is much
            # faster than decoding at full resolution.
            img.draft("L", (HASH_SIZE * 8, HASH_SIZE * 8))
            small = img.convert("L").resize(
                (HASH_SIZE + 1, HASH_SIZE), Image.Resampling.LANCZOS
            )
    except (OSError, UnidentifiedImageError, Image.DecompressionBombError):
        LOGGER.debug(f"Failed to hash image {image}", exc_info=True)
        return None

    pixels = small.tobytes()
    result = 0
    for row in range(HASH_SIZE):
        offset = row * (HASH_SIZE + 1)
        for col in range(HASH_SIZE):
            result = (result << 1) | (
                pixels[offset + col] > pixels[offset + col + 1]
            )
    return result


def hash_distance(hash1: int, hash2: int) -> float:
    """Get how different two image hashes are.

    Args:
        hash1 (int): The first hash.
        hash2 (int): The second hash.

    Returns:
        float: The fraction of differing bits, between 0.0 (identical)
            and 1.0.
    """
    return (hash1 ^ hash2).bit_count() / (HASH_SIZE * HASH_SIZE)


@contextmanager
def open_archive_images(
    archive_file: str, volume_folder: str
) -> Generator[dict[str, ImageOpener]]:
    """Give access to the images inside a CBZ/ZIP or CBR/RAR file without
    modifying it. RAR files are extracted next to the archive for the duration
    of the context.

    Args:
        archive_file (str): The path to the archive file.
        volume_folder (str): The folder of the volume the archive belongs to.

    Yields:
        dict[str, ImageOpener]: Map of filename inside the archive to a
            function opening the image. Only valid inside the context.
    """
    lower = archive_file.lower()

    if lower.endswith((".cbz", ".zip")):
        with ZipFile(archive_file, "r") as zip:
            yield {
                info.filename: partial(zip.open, info)
                for info in zip.infolist()
                if not info.is_dir()
                and info.filename.lower().endswith(
                    FileConstants.IMAGE_EXTENSIONS
                )
            }
        return

    if lower.endswith((".cbr", ".rar")) and try_rar():
        archive_folder = generate_archive_folder(volume_folder, archive_file)
        create_folder(archive_folder)
        try:
            run_rar(["x", "-inul", archive_file, archive_folder])
            yield {
                relpath(f, archive_folder).replace("\\", "/"): partial(
                    open, f, "rb"
                )
                for f in list_files(archive_folder)
                if f.lower().endswith(FileConstants.IMAGE_EXTENSIONS)
            }
        finally:
            delete_file_folder(archive_folder)
        return

    yield {}


def find_similar_images(
    reference: int,
    images: dict[str, ImageOpener],
    threshold: float = DEFAULT_SIMILARITY_THRESHOLD,
) -> dict[str, float]:
    """Find the images that look like the reference.

    Args:
        reference (int): The hash of the reference image.
        images (dict[str, ImageOpener]): Map of name to image opener.
        threshold (float, optional): Maximum distance to be considered similar.
            Defaults to DEFAULT_SIMILARITY_THRESHOLD.

    Returns:
        dict[str, float]: Map of name to distance of the similar images.
    """
    result: dict[str, float] = {}
    for name, opener in images.items():
        with opener() as fh:
            image_hash = hash_image(fh)
        if image_hash is None:
            continue

        distance = hash_distance(reference, image_hash)
        if distance <= threshold:
            result[name] = distance

    return result
