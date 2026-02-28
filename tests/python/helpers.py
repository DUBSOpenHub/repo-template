"""
Shared test helpers for Python tests.

Deterministic utilities — no randomness, no I/O, no side effects.
"""
from typing import Any, Dict, List, Optional


def create_fixture(overrides: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """Create a deterministic fixture dict with optional overrides."""
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


def create_fixture_list(count: int, overrides: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
    """Create N deterministic fixture dicts."""
    return [
        create_fixture({
            "id": f"test-id-{i+1:03d}",
            "name": f"Test Item {i+1}",
            **(overrides or {}),
        })
        for i in range(count)
    ]


def create_mock_response(status: int, body: Any, headers: Optional[Dict[str, str]] = None):
    """Create a mock HTTP response object for testing without network calls."""
    class MockResponse:
        def __init__(self):
            self.status_code = status
            self.ok = 200 <= status < 300
            self.headers = headers or {}
            self._body = body

        def json(self):
            return self._body

        def text(self):
            import json
            return json.dumps(self._body)

        def raise_for_status(self):
            if not self.ok:
                raise Exception(f"HTTP {self.status_code}")

    return MockResponse()
