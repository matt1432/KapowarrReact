import re
from collections import Counter
from os.path import dirname
from zipfile import ZipFile, ZipInfo

from backend.base.files import delete_file_folder, generate_archive_folder
from backend.base.logging import LOGGER


# FIXME: improve prefix logic
def find_outliers(files: list[ZipInfo]):
    strings = [file.filename for file in files if not file.is_dir()]

    # Extract prefix: everything up to the last occurrence of three digits
    prefixes = []

    for s in strings:
        match = list(re.finditer(r"\d{3}", s.split("/")[-1]))
        if match:
            last = match[-1]
            prefixes.append(s[: last.end() - 3])
        else:
            prefixes.append(s)  # If no 3-digit sequence, use the whole string as prefix

    most_common_prefix, _ = Counter(prefixes).most_common(1)[0]
    outliers = [s for s, p in zip(strings, prefixes) if p != most_common_prefix]

    # If there are as many outliers as original files, there are no outliers
    return outliers if len(outliers) != len(files) else []


def get_ad_filenames(file: str) -> list[str]:
    """
    Gets all outliers that start with the letter 'z'. Most ads
    will have one or more z's at the start of the filename to
    show at the end of the book.
    """
    with ZipFile(file, "r") as zip:
        return [
            outlier
            for outlier in find_outliers(zip.infolist())
            if outlier.split("/")[-1].lower().startswith("z")
        ]


def remove_ads(file: str) -> None:
    archive_folder = generate_archive_folder(dirname(file), file)

    # TODO: support removing ads from CBR
    if not file.endswith(".cbz"):
        return

    ads = get_ad_filenames(file)

    if len(ads) == 0:
        return

    with ZipFile(file, "r") as zip:
        files = zip.namelist()
        zip.extractall(archive_folder)

    with ZipFile(file, "w") as zip:
        for f in files:
            if f not in ads:
                zip.write(filename=f"{archive_folder}/{f}", arcname=f)

    delete_file_folder(archive_folder)

    LOGGER.info(f"Removed ads: {ads}")
