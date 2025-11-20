from asyncio import gather, run
from datetime import date, datetime
from typing import TypedDict

from bs4 import BeautifulSoup

from backend.base.definitions import SpecialVersion
from backend.base.file_extraction import extract_filename_data
from backend.base.helpers import AsyncSession


class ParseMarvelIssueSummary(TypedDict):
    marvel_id: int
    title: str
    link: str
    # cover: str | None


class ParseMarvelIssue(ParseMarvelIssueSummary):
    date: date | None
    description: str
    issue_number: float | None


def parse_marvel_series(soup: BeautifulSoup) -> list[ParseMarvelIssueSummary]:
    results: list[ParseMarvelIssueSummary] = []
    for issue in soup.select(".FeaturedGrid__Container.comic div.Card"):
        # img_src: str | None = None

        # img_el = issue.select_one("img")
        # if img_el is not None:
        #     _img_src = img_el.attrs.get("src", None)
        #     if _img_src is not None:
        #         img_src = str(_img_src)

        issue_link: str | None = None
        issue_name: str | None = None

        title_el = issue.select_one(".ComicCard__Meta__Title a")
        if title_el is not None:
            _issue_link = title_el.get("href", None)
            if _issue_link is not None:
                issue_link = "https://www.marvel.com" + str(_issue_link)
                issue_id = int(issue_link.split("/")[-2])

                issue_name = title_el.get_text()

                results.append(
                    ParseMarvelIssueSummary(
                        marvel_id=issue_id,
                        title=issue_name,
                        link=issue_link,
                        # cover=img_src,
                    )
                )
    return results


def parse_marvel_issue(
    soup: BeautifulSoup,
    special_version: SpecialVersion,
    summary: ParseMarvelIssueSummary,
) -> ParseMarvelIssue:
    title: str | None = None
    published_date: date | None = None
    desc: str | None = None

    masthead = soup.select_one(".ComicMasthead")
    if masthead is not None:
        published_date_el = masthead.select_one(".ComicMasthead__Meta_Text")
        if published_date_el is not None:
            published_date = datetime.strptime(
                published_date_el.get_text(), "%B %d, %Y"
            ).date()

        desc_el = masthead.select_one(".ComicMasthead__Description")
        if desc_el is not None:
            desc = desc_el.get_text()

        title_el = masthead.select_one(
            ".ComicMasthead__Title .ModuleHeader span"
        )
        if title_el is not None:
            title = title_el.get_text()

            efd = extract_filename_data(title)
            issue_number = efd["issue_number"]

            if special_version == SpecialVersion.VOLUME_AS_ISSUE:
                issue_number = efd["volume_number"]

            return ParseMarvelIssue(
                marvel_id=summary["marvel_id"],
                title=title,
                link=summary["link"],
                # cover=summary["cover"],
                date=published_date,
                description=desc or "",
                issue_number=issue_number[0]
                if isinstance(issue_number, tuple)
                else issue_number,
            )

    return ParseMarvelIssue(
        marvel_id=summary["marvel_id"],
        title=summary["title"],
        link=summary["link"],
        # cover=summary["cover"],
        date=published_date,
        description=desc or "",
        issue_number=None,
    )


async def _get_page(session: AsyncSession, site_url: str):
    req = await session.get(site_url)
    return await req.text()


async def _get_marvel_issues(
    id: int, special_version: SpecialVersion
) -> list[ParseMarvelIssue]:
    async with AsyncSession() as session:
        series_page = await _get_page(
            session, f"https://www.marvel.com/comics/series/{id}"
        )
        summaries = parse_marvel_series(
            BeautifulSoup(series_page, "html.parser")
        )

        requests = await gather(
            *[
                _get_page(session, issue["link"])
                for issue in summaries
                if issue["link"] is not None
            ]
        )
    return [
        parse_marvel_issue(
            BeautifulSoup(req, "html.parser"), special_version, summaries[i]
        )
        for i, req in enumerate(requests)
    ]


def get_marvel_issues(
    marvel_id: int | None, special_version: SpecialVersion
) -> list[ParseMarvelIssue]:
    if marvel_id is None:
        return []
    return run(_get_marvel_issues(marvel_id, special_version))
