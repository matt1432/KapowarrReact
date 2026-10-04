from io import BytesIO
from zipfile import ZipFile

from PIL import Image, ImageDraw

from backend.implementations.ad_removal import remove_files_from_archive
from backend.implementations.image_comparison import (
    DEFAULT_SIMILARITY_THRESHOLD,
    find_similar_images,
    hash_distance,
    hash_image,
    open_archive_images,
)


def _make_page(seed: int, size: tuple[int, int] = (800, 1200)) -> Image.Image:
    img = Image.new("RGB", size, "white")
    draw = ImageDraw.Draw(img)
    w, h = size
    for i in range(12):
        x = (seed * 97 + i * 131) % w
        y = (seed * 53 + i * 211) % h
        color = ((seed * 40 + i * 20) % 256, (i * 70) % 256, (seed * 90) % 256)
        draw.rectangle((x, y, x + w // 4, y + h // 6), fill=color)
    return img


def _to_bytes(img: Image.Image, fmt: str = "JPEG", **kwargs) -> BytesIO:
    buf = BytesIO()
    img.save(buf, fmt, **kwargs)
    buf.seek(0)
    return buf


class TestHashImage:
    def test_identical_images(self):
        page = _make_page(1)
        assert hash_image(_to_bytes(page)) == hash_image(_to_bytes(page))

    def test_resized_and_recompressed_is_similar(self):
        page = _make_page(1)
        original = hash_image(_to_bytes(page, quality=95))
        altered = hash_image(
            _to_bytes(page.resize((400, 600)), "PNG"),
        )
        assert original is not None and altered is not None
        assert hash_distance(original, altered) <= DEFAULT_SIMILARITY_THRESHOLD

    def test_different_images_are_not_similar(self):
        hash1 = hash_image(_to_bytes(_make_page(1)))
        hash2 = hash_image(_to_bytes(_make_page(7)))
        assert hash1 is not None and hash2 is not None
        assert hash_distance(hash1, hash2) > DEFAULT_SIMILARITY_THRESHOLD

    def test_invalid_image(self):
        assert hash_image(BytesIO(b"not an image")) is None


class TestArchives:
    def _make_cbz(self, path: str) -> None:
        with ZipFile(path, "w") as zip:
            zip.writestr("book/001.jpg", _to_bytes(_make_page(1)).read())
            zip.writestr("book/002.jpg", _to_bytes(_make_page(2)).read())
            zip.writestr(
                "book/zz_ad.jpg",
                _to_bytes(_make_page(9).resize((700, 1100))).read(),
            )
            zip.writestr("book/ComicInfo.xml", "<ComicInfo/>")

    def test_find_similar_images_in_archive(self, tmp_path):
        cbz = str(tmp_path / "book.cbz")
        self._make_cbz(cbz)

        reference = hash_image(_to_bytes(_make_page(9)))
        assert reference is not None

        with open_archive_images(cbz, str(tmp_path)) as images:
            assert sorted(images) == [
                "book/001.jpg",
                "book/002.jpg",
                "book/zz_ad.jpg",
            ]
            assert list(find_similar_images(reference, images)) == [
                "book/zz_ad.jpg"
            ]

    def test_remove_files_from_archive(self, tmp_path):
        cbz = str(tmp_path / "book.cbz")
        self._make_cbz(cbz)

        remove_files_from_archive(cbz, {"book/zz_ad.jpg"})

        with ZipFile(cbz) as zip:
            assert sorted(zip.namelist()) == [
                "book/001.jpg",
                "book/002.jpg",
                "book/ComicInfo.xml",
            ]
