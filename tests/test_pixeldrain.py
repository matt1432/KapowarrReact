from unittest.mock import MagicMock, patch

import pytest

from backend.base.custom_exceptions import DownloadServiceRateLimitReached
from backend.implementations.download_clients.PixelDrain import (
    PixelDrainDownload,
)

SESSION_PATH = "backend.implementations.download_clients.PixelDrain.Session"
STATUS_PATH = (
    "backend.implementations.download_clients.PixelDrain.StatusHandlers"
)


def _paid_account_response(
    account_cap: int, used: int = 100, plan_cap: int = 1_000_000
) -> dict:
    return {
        "subscription": {"type": "patreon", "monthly_transfer_cap": plan_cap},
        "monthly_transfer_used": used,
        "monthly_transfer_cap": account_cap,
    }


def _mock_response(session_cls: MagicMock, response: dict) -> None:
    session = session_cls.return_value.__enter__.return_value
    session.get.return_value.status_code = 200
    session.get.return_value.json.return_value = response


class TestPixeldrainLogin:
    @patch(SESSION_PATH)
    def test_paid_account_no_custom_cap_uses_plan_cap(
        self, session_cls: MagicMock
    ):
        """
        A paid account with no custom transfer cap (`monthly_transfer_cap`
        is `0`) should fall back to the plan's default cap instead of being
        treated as an actual 0-byte limit.
        """
        _mock_response(
            session_cls,
            _paid_account_response(account_cap=0, used=100, plan_cap=1_000_000),
        )

        # Should not raise: 100 used is well under the 1,000,000 plan cap.
        PixelDrainDownload.login("some-api-key")

    @patch(SESSION_PATH)
    def test_paid_account_custom_cap_still_enforced(
        self, session_cls: MagicMock
    ):
        """A real, positive custom cap should still be enforced as before."""
        _mock_response(
            session_cls,
            _paid_account_response(
                account_cap=100, used=200, plan_cap=1_000_000
            ),
        )

        with patch(STATUS_PATH), pytest.raises(DownloadServiceRateLimitReached):
            PixelDrainDownload.login("some-api-key")

    @patch(SESSION_PATH)
    def test_paid_account_unlimited_cap(self, session_cls: MagicMock):
        """`-1` at the account level still means unlimited, unchanged."""
        _mock_response(
            session_cls,
            _paid_account_response(
                account_cap=-1, used=1_000_000_000, plan_cap=1_000
            ),
        )

        # Should not raise, regardless of how much has been used.
        PixelDrainDownload.login("some-api-key")

    @patch(SESSION_PATH)
    def test_paid_account_no_custom_cap_and_unlimited_plan(
        self, session_cls: MagicMock
    ):
        """
        `0` at the account level falling back to an unlimited plan cap
        (`-1`).
        """
        _mock_response(
            session_cls,
            _paid_account_response(
                account_cap=0, used=1_000_000_000, plan_cap=-1
            ),
        )

        # Should not raise: plan cap is unlimited.
        PixelDrainDownload.login("some-api-key")
