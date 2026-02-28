"""
Edge Case Test Template (Python)

Boundary conditions, empty inputs, unicode, extreme values.
"""
import pytest
import math


# ─── Example functions ───

def truncate(text, max_len):
    if not isinstance(text, str):
        return ""
    if len(text) <= max_len:
        return text
    return text[:max_len - 3] + "..."


def safe_divide(a, b):
    if b == 0:
        return {"ok": False, "error": "division by zero"}
    if not (math.isfinite(a) and math.isfinite(b)):
        return {"ok": False, "error": "invalid input"}
    return {"ok": True, "value": a / b}


def parse_key_value(text, delimiter="="):
    if not text or not isinstance(text, str):
        return None
    idx = text.find(delimiter)
    if idx == -1:
        return None
    return {"key": text[:idx], "value": text[idx + 1:]}


# ─── Tests ───

class TestTruncate:
    def test_empty_string(self):
        assert truncate("", 10) == ""

    def test_shorter_than_max(self):
        assert truncate("hi", 10) == "hi"

    def test_exactly_at_max(self):
        assert truncate("1234567890", 10) == "1234567890"

    def test_longer_than_max(self):
        assert truncate("12345678901", 10) == "1234567..."

    def test_max_length_3(self):
        assert truncate("hello", 3) == "..."

    def test_none_input(self):
        assert truncate(None, 10) == ""

    def test_numeric_input(self):
        assert truncate(12345, 10) == ""

    def test_unicode(self):
        assert truncate("héllo wörld", 8) == "héllo..."

    def test_emoji(self):
        assert truncate("😀😀😀😀😀", 4) == "😀..."


class TestSafeDivide:
    def test_normal_division(self):
        assert safe_divide(10, 2) == {"ok": True, "value": 5.0}

    def test_division_by_zero(self):
        assert safe_divide(10, 0) == {"ok": False, "error": "division by zero"}

    def test_zero_numerator(self):
        assert safe_divide(0, 5) == {"ok": True, "value": 0.0}

    def test_infinity_input(self):
        assert safe_divide(float("inf"), 2) == {"ok": False, "error": "invalid input"}

    def test_nan_input(self):
        assert safe_divide(float("nan"), 2) == {"ok": False, "error": "invalid input"}

    def test_negative_numbers(self):
        assert safe_divide(-10, 2) == {"ok": True, "value": -5.0}


class TestParseKeyValue:
    def test_simple(self):
        assert parse_key_value("name=Alice") == {"key": "name", "value": "Alice"}

    def test_value_with_delimiter(self):
        assert parse_key_value("eq=a=b=c") == {"key": "eq", "value": "a=b=c"}

    def test_empty_value(self):
        assert parse_key_value("key=") == {"key": "key", "value": ""}

    def test_empty_key(self):
        assert parse_key_value("=value") == {"key": "", "value": "value"}

    def test_no_delimiter(self):
        assert parse_key_value("nope") is None

    def test_empty_string(self):
        assert parse_key_value("") is None

    def test_none_input(self):
        assert parse_key_value(None) is None

    def test_custom_delimiter(self):
        assert parse_key_value("key:value", ":") == {"key": "key", "value": "value"}


class TestPythonEdgeCases:
    """Python-specific gotchas that bite in production."""

    def test_none_is_not_false(self):
        assert None is not False
        assert (None == False) is False  # noqa: E712

    def test_empty_list_is_falsy(self):
        assert not []
        assert bool([]) is False

    def test_zero_is_falsy(self):
        assert not 0
        assert (0 is False) is False  # identity vs equality

    def test_mutable_default_args_trap(self):
        """The classic Python gotcha: mutable default arguments."""
        def append_to(item, target=None):
            if target is None:
                target = []
            target.append(item)
            return target

        result1 = append_to(1)
        result2 = append_to(2)
        assert result1 == [1]
        assert result2 == [2]  # would fail with mutable default
