"""
Integration Test Template — Component Interaction (Python)

Tests how modules work together. External dependencies are fully mocked.
"""
import pytest
from unittest.mock import AsyncMock, MagicMock, patch


# ─── Example: Service with dependencies ───

class UserService:
    def __init__(self, store, logger):
        self.store = store
        self.logger = logger

    def get_user(self, user_id):
        self.logger.info(f"Fetching user {user_id}")
        user = self.store.find_by_id(user_id)
        if not user:
            self.logger.warning(f"User {user_id} not found")
            return None
        return user

    def create_user(self, data):
        if not data.get("name"):
            raise ValueError("Name is required")
        user = {"id": "usr-001", **data, "created_at": "2024-01-15T12:00:00+00:00"}
        self.store.save(user)
        self.logger.info(f"Created user {user['id']}")
        return user

    def list_users(self, filters=None):
        users = self.store.find_all(filters or {})
        self.logger.info(f"Listed {len(users)} users")
        return users


# ─── Tests ───

class TestUserServiceGetUser:
    def setup_method(self):
        self.store = MagicMock()
        self.logger = MagicMock()
        self.service = UserService(self.store, self.logger)

    def test_returns_user_when_found(self, make_fixture):
        user = make_fixture({"id": "usr-1", "name": "Alice"})
        self.store.find_by_id.return_value = user

        result = self.service.get_user("usr-1")

        assert result == user
        self.store.find_by_id.assert_called_once_with("usr-1")
        self.logger.info.assert_called_once()

    def test_returns_none_when_not_found(self):
        self.store.find_by_id.return_value = None

        result = self.service.get_user("nonexistent")

        assert result is None
        self.logger.warning.assert_called_once()

    def test_propagates_store_errors(self):
        self.store.find_by_id.side_effect = RuntimeError("DB connection failed")

        with pytest.raises(RuntimeError, match="DB connection failed"):
            self.service.get_user("usr-1")


class TestUserServiceCreateUser:
    def setup_method(self):
        self.store = MagicMock()
        self.logger = MagicMock()
        self.service = UserService(self.store, self.logger)

    def test_creates_and_persists_user(self):
        result = self.service.create_user({"name": "Bob", "email": "bob@test.com"})

        assert result["name"] == "Bob"
        assert result["email"] == "bob@test.com"
        assert "id" in result
        self.store.save.assert_called_once()

    def test_raises_on_missing_name(self):
        with pytest.raises(ValueError, match="Name is required"):
            self.service.create_user({"email": "no-name@test.com"})

        self.store.save.assert_not_called()


class TestUserServiceListUsers:
    def setup_method(self):
        self.store = MagicMock()
        self.logger = MagicMock()
        self.service = UserService(self.store, self.logger)

    def test_returns_all_users(self, make_fixture_list):
        users = make_fixture_list(3)
        self.store.find_all.return_value = users

        result = self.service.list_users()

        assert len(result) == 3
        self.store.find_all.assert_called_once_with({})

    def test_passes_filters_to_store(self):
        self.store.find_all.return_value = []
        self.service.list_users({"status": "active"})

        self.store.find_all.assert_called_once_with({"status": "active"})
