import os
import re
import shutil
from collections import Counter
from zipfile import ZipFile, ZipInfo

from backend.base.logging import LOGGER


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

    # Find the most common prefix
    most_common_prefix, _ = Counter(prefixes).most_common(1)[0]

    # Find outliers: strings that don't start with this prefix
    outliers = [s for s, p in zip(strings, prefixes) if p != most_common_prefix]

    if len(outliers) == len(files):
        return []
    return outliers


def get_ad_filenames(file: str) -> list[str]:
    with ZipFile(file, "r") as zip:
        return [
            outlier
            for outlier in find_outliers(zip.infolist())
            if outlier.split("/")[-1].lower().startswith("z")
        ]


def remove_ads(file: str) -> None:
    # TODO: replace this with a proper solution like in converters
    folder = "/tmp"

    if not file.endswith(".cbz"):
        return

    ads = get_ad_filenames(file)

    if len(ads) == 0:
        return

    with ZipFile(file, "r") as zip:
        files = zip.infolist()
        zip.extractall(folder)

    with ZipFile(file, "w") as zip:
        for file in [f"{folder}/{f.filename}" for f in files if f.filename not in ads]:
            zip.write(file)

    LOGGER.info(f"Removed ads: {ads}")

    for f in files:
        if f.is_dir():
            shutil.rmtree(f"{folder}/{f.filename}")
            return
        else:
            os.remove(f"{folder}/{f.filename}")
