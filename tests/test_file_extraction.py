from backend.base.file_extraction import (
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
        result = extract_filename_data("Batman Issue 1.cbr")
        assert result["series"] == "Batman"
        assert result["issue_number"] == 1.0

    def test_issue_with_year(self):
        result = extract_filename_data("Batman (2020) Issue 1.cbz")
        assert result["series"] == "Batman"
        assert result["year"] == 2020
        assert result["issue_number"] == 1.0

    def test_volume(self):
        result = extract_filename_data("Batman Volume 2.cbz")
        assert result["series"] == "Batman"
        assert result["volume_number"] == 2
        assert result["special_version"] == "tpb"

    def test_special_version_omnibus(self):
        result = extract_filename_data("Batman Omnibus (2022).cbz")
        assert result["series"] == "Batman"
        assert result["year"] == 2022
        assert result["special_version"] == "omnibus"

    def test_special_version_one_shot(self):
        result = extract_filename_data("Batman One-Shot (2020).cbr")
        assert result["series"] == "Batman"
        assert result["special_version"] == "one-shot"

    def test_full_path(self):
        result = extract_filename_data(
            "/Comics/Batman/Volume 1 (1940)/Batman (1940) Volume 2 Issue 11.cbz"
        )
        assert result["series"] == "Batman"
        assert result["year"] == 1940
        assert result["volume_number"] == 2
        assert result["issue_number"] == 11.0
