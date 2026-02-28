"""
Shared pytest fixtures and configuration.

All fixtures here are available to every test file automatically.
Designed for determinism: frozen time, predictable IDs, no randomness.
"""
import pytest
from datetime import datetime, timezone
from unittest.mock import MagicMock


# ─── Frozen Time ───

FROZEN_TIME = datetime(2024, 1, 15, 12, 0, 0, tzinfo=timezone.utc)


@pytest.fixture(autouse=True)
def freeze_time(monkeypatch):
    """Freeze datetime.now() to a deterministic value across all tests."""
    import datetime as dt_module

    class FrozenDatetime(datetime):
        @classmethod
        def now(cls, tz=None):
            return FROZEN_TIME

        @classmethod
        def utcnow(cls):
            return FROZEN_TIME.replace(tzinfo=None)

    monkeypatch.setattr(dt_module, "datetime", FrozenDatetime)


# ─── Fixture Factory ───

@pytest.fixture
def make_fixture():
    """Factory fixture that creates deterministic test objects."""
    def _make(overrides=None):
        base = {
            "id": "test-id-001",
            "name": "Test Item",
            "created_at": "2024-01-15T12:00:00+00:00",
            "updated_at": "2024-01-15T12:00:00+00:00",
            "status": "active",
            "metadata": {},
        }
        if overrides:
            base.update(overrides)
        return base
    return _make


@pytest.fixture
def make_fixture_list(make_fixture):
    """Factory fixture that creates a list of N deterministic test objects."""
    def _make(count, overrides=None):
        return [
            make_fixture({
                "id": f"test-id-{i+1:03d}",
                "name": f"Test Item {i+1}",
                **(overrides or {}),
            })
            for i in range(count)
        ]
    return _make


# ─── Mock Logger ───

@pytest.fixture
def mock_logger():
    """Logger mock that captures all log calls for assertion."""
    logger = MagicMock()
    logger.info_calls = []
    logger.warn_calls = []
    logger.error_calls = []

    def capture_info(*args):
        logger.info_calls.append(args)
    def capture_warn(*args):
        logger.warn_calls.append(args)
    def capture_error(*args):
        logger.error_calls.append(args)

    logger.info.side_effect = capture_info
    logger.warning.side_effect = capture_warn
    logger.error.side_effect = capture_error
    return logger


# ─── Temp Directory ───

@pytest.fixture
def tmp_workdir(tmp_path):
    """Provides a temporary working directory that is automatically cleaned up."""
    return tmp_path
