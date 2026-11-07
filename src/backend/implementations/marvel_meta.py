from asyncio import run
from datetime import date
from typing import Any, TypedDict

from backend.base.definitions import SpecialVersion
from backend.base.file_extraction import extract_filename_data
from backend.base.helpers import AsyncSession

# Internal API used by marvel.com's series page (and its "Load More" button)
MARVEL_API_URL = "https://bifrost.marvel.com/v1/catalog/comics/"
MARVEL_API_PAGE_SIZE = 500


class ParseMarvelIssue(TypedDict):
    marvel_id: int
    title: str
    link: str
    date: date | None
    description: str
    issue_number: float | None


def _parse_issue_number(
    metadata: dict[str, Any], special_version: SpecialVersion
) -> float | None:
    if special_version == SpecialVersion.VOLUME_AS_ISSUE:
        number = extract_filename_data(filepath=metadata["title"])[
            "volume_number"
        ]
    else:
        number = metadata.get("issue_number")
        if number is None:
            number = extract_filename_data(filepath=metadata["title"])[
                "issue_number"
            ]

    if isinstance(number, tuple):
        number = number[0]
    return float(number) if number is not None else None


def parse_marvel_issue(
    metadata: dict[str, Any], special_version: SpecialVersion
) -> ParseMarvelIssue:
    published_date: date | None = None
    if metadata.get("published_date"):
        try:
            published_date = date.fromisoformat(metadata["published_date"])
        except ValueError:
            pass

    return ParseMarvelIssue(
        marvel_id=int(metadata["id"]),
        title=metadata["title"],
        link=metadata["url"],
        date=published_date,
        description=metadata.get("description") or "",
        issue_number=_parse_issue_number(metadata, special_version),
    )


async def _get_marvel_issues(
    id: int, special_version: SpecialVersion
) -> list[ParseMarvelIssue]:
    results: list[dict[str, Any]] = []
    async with AsyncSession() as session:
        while True:
            response = await session.get(
                MARVEL_API_URL,
                params={
                    "byId": id,
                    "byZone": "marvel_site_zone",
                    "byType": "comic_series",
                    "orderBy": "release_date+desc",
                    "formatType": "issue,digitalcomic,collection,digitalverticalcomic",
                    "limit": MARVEL_API_PAGE_SIZE,
                    "offset": len(results),
                    "variants": "false",
                },
            )
            data = (await response.json())["data"]
            page: list[dict[str, Any]] = data.get("results") or []
            results.extend(page)

            if not page or len(results) >= int(data.get("total") or 0):
                break

    return [parse_marvel_issue(r["metadata"], special_version) for r in results]


def get_marvel_issues(
    marvel_id: int | None, special_version: SpecialVersion
) -> list[ParseMarvelIssue]:
    if marvel_id is None:
        return []
    return run(_get_marvel_issues(marvel_id, special_version))
