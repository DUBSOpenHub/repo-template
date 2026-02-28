"""
Regression Test Template (Python)

Each test documents a specific bug. References issue number in docstring.
"""
import pytest
from urllib.parse import urlencode, quote


# ─── Example functions with historical bugs ───

def parse_version(version_str):
    if not version_str or not isinstance(version_str, str):
        return None
    import re
    match = re.match(r"^v?(\d+)\.(\d+)\.(\d+)$", version_str)
    if not match:
        return None
    return {
        "major": int(match.group(1)),
        "minor": int(match.group(2)),
        "patch": int(match.group(3)),
    }


def merge_defaults(user_config, defaults):
    result = {**defaults}
    for key, value in (user_config or {}).items():
        if value is not None:
            result[key] = value
    return result


def build_url(base, path=None, params=None):
    import re
    url = re.sub(r"/+$", "", base)
    if path:
        url += "/" + re.sub(r"^/+", "", path)
    if params:
        filtered = {k: v for k, v in params.items() if v is not None}
        if filtered:
            qs = "&".join(f"{quote(str(k))}={quote(str(v))}" for k, v in filtered.items())
            url += "?" + qs
    return url


# ─── Regression Tests ───

class TestParseVersionRegression:
    """Bug #142: parseVersion('v1.2.3') returned None."""

    def test_without_prefix(self):
        assert parse_version("1.2.3") == {"major": 1, "minor": 2, "patch": 3}

    def test_with_v_prefix(self):
        """The actual regression: v prefix was not handled."""
        assert parse_version("v1.2.3") == {"major": 1, "minor": 2, "patch": 3}

    def test_rejects_incomplete(self):
        assert parse_version("1.2") is None

    def test_rejects_garbage(self):
        assert parse_version("abc") is None

    def test_rejects_none(self):
        assert parse_version(None) is None


class TestMergeDefaultsRegression:
    """Bug #187: merge_defaults({'retries': 0}, {'retries': 3}) returned 3."""

    def test_preserves_zero(self):
        """The regression: falsy values were dropped."""
        result = merge_defaults({"retries": 0}, {"retries": 3})
        assert result["retries"] == 0

    def test_preserves_false(self):
        result = merge_defaults({"verbose": False}, {"verbose": True})
        assert result["verbose"] is False

    def test_preserves_empty_string(self):
        result = merge_defaults({"prefix": ""}, {"prefix": "default"})
        assert result["prefix"] == ""

    def test_uses_default_for_none(self):
        result = merge_defaults({"retries": None}, {"retries": 3})
        assert result["retries"] == 3

    def test_uses_default_when_missing(self):
        result = merge_defaults({}, {"retries": 3})
        assert result["retries"] == 3


class TestBuildUrlRegression:
    """Bug #203: Double slash between base and path."""

    def test_trailing_plus_leading_slash(self):
        assert build_url("https://api.example.com/", "/users") == "https://api.example.com/users"

    def test_no_slashes(self):
        assert build_url("https://api.example.com", "users") == "https://api.example.com/users"

    def test_multiple_trailing_slashes(self):
        assert build_url("https://api.example.com///", "/users") == "https://api.example.com/users"

    def test_with_params(self):
        result = build_url("https://api.example.com", "users", {"page": 1})
        assert result == "https://api.example.com/users?page=1"

    def test_excludes_none_params(self):
        result = build_url("https://api.example.com", "users", {"page": 1, "q": None})
        assert result == "https://api.example.com/users?page=1"

    def test_encodes_special_chars(self):
        result = build_url("https://api.example.com", "search", {"q": "hello world"})
        assert result == "https://api.example.com/search?q=hello%20world"
