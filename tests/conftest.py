# tests/conftest.py
import sys
import os
import pytest
from uuid import uuid4
from datetime import datetime, timedelta

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

# /app を sys.path に追加
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.main import app
from app.api import deps
from app.core.database import SessionLocal
from app.models.user import User
from app.services.user_service import UserService
from app.schemas.user import UserCreate
from app.models.category import Category, CategoryColor
from app.models.schedule import Schedule, ScheduleDate


# =========================
# raw_client
# =========================
# ・override なし
# ・DB 初期状態そのまま
# ・auth / validation / 401 用
@pytest.fixture
def raw_client():
    app.dependency_overrides.clear()
    with TestClient(app) as c:
        yield c


# =========================
# client（CRUD 用）
# =========================
# ・DB に存在する User を作成
# ・その User を current_user として override
# ・テスト終了時に破棄
@pytest.fixture
def client():
    # --- DB セッション作成 ---
    db: Session = SessionLocal()

    # --- User 作成（DBに永続化） ---
    user_service = UserService(db)
    user = user_service.signup(
        UserCreate(
            email=f"test-{uuid4()}@example.com",
            password="password123",
            name="Test User",
        )
    )

    # --- override 定義 ---
    def override_get_current_user():
        return user

    app.dependency_overrides[deps.get_current_user] = override_get_current_user

    # --- TestClient 起動 ---
    with TestClient(app) as c:
        yield c

    # --- teardown ---
    app.dependency_overrides.clear()
    db.delete(user)
    db.commit()
    db.close()


@pytest.fixture
def category(client):
    db: Session = SessionLocal()

    # current user from override
    user = app.dependency_overrides[deps.get_current_user]()

    category = Category(
        user_id=user.id,
        name="Test Category",
        color=CategoryColor.gray,
    )
    db.add(category)
    db.commit()
    db.refresh(category)

    yield category

    db.close()


@pytest.fixture
def schedule(client):
    db: Session = SessionLocal()

    user = app.dependency_overrides[deps.get_current_user]()

    category = Category(
        user_id=user.id,
        name="Test Category",
        color=CategoryColor.gray,
    )
    db.add(category)
    db.commit()
    db.refresh(category)

    schedule = Schedule(
        title="Test Schedule",
        user_id=user.id,
        category_id=category.id,
    )
    db.add(schedule)
    db.commit()
    db.refresh(schedule)

    date = ScheduleDate(
        schedule_id=schedule.id,
        start_date=datetime.now(),
        end_date=datetime.now() + timedelta(hours=1),
    )
    db.add(date)
    db.commit()
    db.refresh(schedule)

    yield schedule

    db.delete(schedule)
    db.delete(category)
    db.commit()
    db.close()
