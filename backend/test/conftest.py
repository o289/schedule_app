# test/conftest.py
import sys, os
import pytest
from fastapi.testclient import TestClient

# /app を sys.path に追加
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.main import app   # これでOK

# get_current_user をモック化
from app.api import deps
from app.models.user import User
from uuid import uuid4

def override_get_current_user():
    return User(id=uuid4(), email="test@example.com", name="Test User")

app.dependency_overrides[deps.get_current_user] = override_get_current_user


@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c