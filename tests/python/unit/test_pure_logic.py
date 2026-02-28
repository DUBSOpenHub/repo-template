"""
Unit Test Template — Pure Logic (Python)

Tests for pure functions with no side effects.
Replace example functions with your actual module imports.
"""
import pytest

# ─── Replace with your actual imports ───
# from src.your_module import add, format_name, clamp, slugify


# Example pure functions
def add(a, b):
    return a + b


def format_name(first, last):
    if not first and not last:
        return ""
    if not first:
        return last.strip()
    if not last:
        return first.strip()
    return f"{first.strip()} {last.strip()}"


def clamp(value, min_val, max_val):
    return min(max(value, min_val), max_val)


def slugify(text):
    import re
    slug = text.lower()
    slug = re.sub(r"[^a-z0-9]+", "-", slug)
    return slug.strip("-")


# ─── Unit Tests ───

class TestArithmetic:
    def test_add_positive_numbers(self):
        assert add(2, 3) == 5

    def test_add_negative_numbers(self):
        assert add(-1, -1) == -2

    def test_add_zero(self):
        assert add(0, 5) == 5

    # Table-driven tests with parametrize
    @pytest.mark.parametrize("a, b, expected", [
        (0, 0, 0),
        (1, 1, 2),
        (-1, 1, 0),
        (100, 200, 300),
        (2**53 - 1, 0, 2**53 - 1),
    ])
    def test_add_parametrized(self, a, b, expected):
        assert add(a, b) == expected


class TestFormatName:
    def test_first_and_last(self):
        assert format_name("John", "Doe") == "John Doe"

    def test_first_only(self):
        assert format_name("John", None) == "John"

    def test_last_only(self):
        assert format_name(None, "Doe") == "Doe"

    def test_both_none(self):
        assert format_name(None, None) == ""

    def test_both_empty(self):
        assert format_name("", "") == ""

    def test_trims_whitespace(self):
        assert format_name("  John  ", "  Doe  ") == "John Doe"


class TestClamp:
    def test_within_range(self):
        assert clamp(5, 0, 10) == 5

    def test_below_minimum(self):
        assert clamp(-5, 0, 10) == 0

    def test_above_maximum(self):
        assert clamp(15, 0, 10) == 10

    def test_equal_min_max(self):
        assert clamp(5, 3, 3) == 3

    def test_at_boundary_min(self):
        assert clamp(0, 0, 10) == 0

    def test_at_boundary_max(self):
        assert clamp(10, 0, 10) == 10


class TestSlugify:
    def test_simple_text(self):
        assert slugify("Hello World") == "hello-world"

    def test_special_characters(self):
        assert slugify("Hello, World!") == "hello-world"

    def test_multiple_spaces(self):
        assert slugify("hello   world") == "hello-world"

    def test_strips_leading_trailing(self):
        assert slugify("  hello world  ") == "hello-world"
