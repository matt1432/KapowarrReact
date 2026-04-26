from backend.base.file_extraction import (
    extract_file_extra_info,
    extract_filename_data,
    extract_issue_number,
    extract_volume_number,
)


class TestExtractIssueNumber:
    def test_simple_number(self):
        assert extract_issue_number("1") == 1.0
        assert extract_issue_number("42") == 42.0

    def test_decimal(self):
        assert extract_issue_number("3.5") == 3.5

    def test_letter_suffix(self):
        assert extract_issue_number("3a") == 3.01
        assert extract_issue_number("3b") == 3.02
        assert extract_issue_number("10c") == 10.03

    def test_unicode_fractions(self):
        assert extract_issue_number("3 ½") == 3.5

    def test_range(self):
        assert extract_issue_number("1-5") == (1.0, 5.0)

    def test_infinity(self):
        assert extract_issue_number("∞") == 9999999999999.0


class TestExtractVolumeNumber:
    def test_simple(self):
        assert extract_volume_number("1") == 1
        assert extract_volume_number("42") == 42

    def test_range(self):
        assert extract_volume_number("1-5") == (1, 5)

    def test_roman_numeral(self):
        assert extract_volume_number("I") == 1
        assert extract_volume_number("V") == 5
        assert extract_volume_number("X") == 10


class TestExtractFilenameData:
    def test_basic_issue(self):
        result = extract_filename_data(
            filepath="Batman Issue 1.cbr",
        )
        assert result["series"] == "Batman"
        assert result["issue_number"] == 1.0

    def test_issue_with_year(self):
        result = extract_filename_data(
            filepath="Batman (2020) Issue 1.cbz",
        )
        assert result["series"] == "Batman"
        assert result["year"] == 2020
        assert result["issue_number"] == 1.0

    def test_volume(self):
        result = extract_filename_data(
            filepath="Batman Volume 2.cbz",
        )
        assert result["series"] == "Batman"
        assert result["volume_number"] == 2
        assert result["special_version"] == "tpb"

    def test_special_version_omnibus(self):
        result = extract_filename_data(
            filepath="Batman Omnibus (2022).cbz",
        )
        assert result["series"] == "Batman"
        assert result["year"] == 2022
        assert result["special_version"] == "omnibus"

    def test_special_version_one_shot(self):
        result = extract_filename_data(
            filepath="Batman One-Shot (2020).cbr",
        )
        assert result["series"] == "Batman"
        assert result["special_version"] == "one-shot"

    def test_full_path(self):
        result = extract_filename_data(
            filepath="/Comics/Batman/Volume 1 (1940)/Batman (1940) Volume 2 Issue 11.cbz",
        )
        assert result["series"] == "Batman"
        assert result["year"] == 1940
        assert result["volume_number"] == 2
        assert result["issue_number"] == 11.0


class TestExtractFileExtraInfo:
    def test_resolution_dpi_releaser(self):
        result = extract_file_extra_info(
            filepath="1602 Witch Hunter Angela Warzones! (2016) Volume 01 [1988x3056][72x72] - Zone-Empire.cbz",
            format="{series_name}{ (year)} Volume {volume_number}{ (notes)}{ [resolution]}{[dpi]}{ - releaser}",
        )
        assert result["resolution"] == "1988x3056"
        assert result["dpi"] == "72x72"
        assert result["releaser"] == "Zone-Empire"

    def test_notes_resolution_dpi_releaser(self):
        result = extract_file_extra_info(
            filepath="X-Men Annual (1970) Issue 013 (Jubilation Day) [2013x3056][72x72] - Marika-Empire.cbz",
            format="{series_name}{ (year)} Issue {issue_number}{ (notes)}{ [resolution]}{[dpi]}{ - releaser}",
        )
        assert result["notes"] == "Jubilation Day"
        assert result["resolution"] == "2013x3056"
        assert result["dpi"] == "72x72"
        assert result["releaser"] == "Marika-Empire"

    def test_releaser_only(self):
        result = extract_file_extra_info(
            filepath="Batman 001 - Empire.cbz",
            format="{series_name} {issue_number}{ - releaser}",
        )
        assert result["releaser"] == "Empire"
        assert result["scan_type"] is None
        assert result["resolution"] is None
        assert result["dpi"] is None
        assert result["notes"] is None

    def test_notes_and_resolution(self):
        result = extract_file_extra_info(
            filepath="Batman 001 (Director's Cut) [2400x3600].cbz",
            format="{series_name} {issue_number}{ (notes)}{ [resolution]}",
        )
        assert result["notes"] == "Director's Cut"
        assert result["resolution"] == "2400x3600"
        assert result["releaser"] is None
        assert result["scan_type"] is None
        assert result["dpi"] is None

    def test_all_extra_info(self):
        result = extract_file_extra_info(
            filepath="Batman 001 (Covers) [3000x4500][300] [Digital] - Gotham.cbz",
            format="{series_name} {issue_number}{ (notes)}{ [resolution]}{[dpi]}{ [scan_type]}{ - releaser}",
        )
        assert result["notes"] == "Covers"
        assert result["resolution"] == "3000x4500"
        assert result["dpi"] == "300"
        assert result["scan_type"] == "Digital"
        assert result["releaser"] == "Gotham"

    def test_no_format_returns_none(self):
        result = extract_file_extra_info(
            filepath="Batman 001 [2400x3600] - Empire.cbz",
            format=None,
        )
        assert result["releaser"] is None
        assert result["scan_type"] is None
        assert result["resolution"] is None
        assert result["dpi"] is None
        assert result["notes"] is None
