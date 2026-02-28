"""
Unit Test Template — Validation Logic (Python)

Tests for input validation, schema checking, and guard clauses.
"""
import pytest
import re


# ─── Example validators ───

def is_email(value):
    if not value or not isinstance(value, str):
        return False
    return bool(re.match(r"^[^\s@]+@[^\s@]+\.[^\s@]+$", value))


def is_in_range(n, min_val, max_val):
    if not isinstance(n, (int, float)) or isinstance(n, bool):
        return False
    if n != n:  # NaN check
        return False
    return min_val <= n <= max_val


def validate_config(config):
    errors = []
    if config is None:
        return {"valid": False, "errors": ["Config is required"]}
    if not isinstance(config.get("name"), str) or not config["name"].strip():
        errors.append("name is required")
    port = config.get("port")
    if not is_in_range(port, 1, 65535):
        errors.append("port must be between 1 and 65535")
    retries = config.get("retries")
    if retries is not None and not is_in_range(retries, 0, 10):
        errors.append("retries must be between 0 and 10")
    return {"valid": len(errors) == 0, "errors": errors}


# ─── Tests ───

class TestIsEmail:
    @pytest.mark.parametrize("email", [
        "user@example.com",
        "a@b.co",
        "test+tag@domain.org",
    ])
    def test_valid_emails(self, email):
        assert is_email(email) is True

    @pytest.mark.parametrize("email", [
        "",
        "not-an-email",
        "@missing.com",
        "no@",
        None,
    ])
    def test_invalid_emails(self, email):
        assert is_email(email) is False


class TestIsInRange:
    def test_within_range(self):
        assert is_in_range(5, 1, 10) is True

    def test_at_boundaries(self):
        assert is_in_range(1, 1, 10) is True
        assert is_in_range(10, 1, 10) is True

    def test_below_range(self):
        assert is_in_range(0, 1, 10) is False

    def test_above_range(self):
        assert is_in_range(11, 1, 10) is False

    def test_nan(self):
        assert is_in_range(float("nan"), 1, 10) is False

    def test_string_rejected(self):
        assert is_in_range("5", 1, 10) is False

    def test_none_rejected(self):
        assert is_in_range(None, 1, 10) is False

    def test_bool_rejected(self):
        assert is_in_range(True, 0, 10) is False


class TestValidateConfig:
    def test_valid_config(self):
        result = validate_config({"name": "myapp", "port": 3000})
        assert result["valid"] is True
        assert result["errors"] == []

    def test_none_config(self):
        result = validate_config(None)
        assert result["valid"] is False
        assert "Config is required" in result["errors"]

    def test_empty_name(self):
        result = validate_config({"name": "", "port": 3000})
        assert result["valid"] is False
        assert "name is required" in result["errors"]

    def test_whitespace_name(self):
        result = validate_config({"name": "   ", "port": 3000})
        assert result["valid"] is False

    def test_port_out_of_range(self):
        result = validate_config({"name": "app", "port": 0})
        assert result["valid"] is False
        assert "port must be between 1 and 65535" in result["errors"]

    def test_retries_valid(self):
        result = validate_config({"name": "app", "port": 3000, "retries": 3})
        assert result["valid"] is True

    def test_retries_out_of_range(self):
        result = validate_config({"name": "app", "port": 3000, "retries": 99})
        assert result["valid"] is False

    def test_multiple_errors(self):
        result = validate_config({"name": "", "port": -1, "retries": 99})
        assert result["valid"] is False
        assert len(result["errors"]) >= 3
