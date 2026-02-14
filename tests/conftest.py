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
from app.models.category import Category, CategoryColor
from app.models.schedule import Schedule, ScheduleDate


@pytest.fixture
def db_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# =========================
# raw_client
# =========================
# ・override なし
# ・DB 初期状態そのまま
# ・auth / validation / 401 用
@pytest.fixture
def raw_client(db_session):
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
def client(db_session):
    # --- User 作成（DBに永続化） ---
    user = User(email=f"test-{uuid4()}@example.com")
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    # --- override 定義 ---
    def override_get_current_user():
        return user

    app.dependency_overrides[deps.get_current_user] = override_get_current_user

    # --- TestClient 起動 ---
    with TestClient(app) as c:
        yield c

    # --- teardown ---
    app.dependency_overrides.clear()
    db_session.delete(user)
    db_session.commit()


@pytest.fixture
def category(client, db_session):

    # current user from override
    user = app.dependency_overrides[deps.get_current_user]()

    category = Category(
        user_id=user.id,
        name="Test Category",
        color=CategoryColor.gray,
    )
    db_session.add(category)
    db_session.commit()
    db_session.refresh(category)

    yield category


@pytest.fixture
def schedule(client, db_session):

    user = app.dependency_overrides[deps.get_current_user]()

    category = Category(
        user_id=user.id,
        name="Test Category",
        color=CategoryColor.gray,
    )
    db_session.add(category)
    db_session.commit()
    db_session.refresh(category)

    schedule = Schedule(
        title="Test Schedule",
        user_id=user.id,
        category_id=category.id,
    )
    db_session.add(schedule)
    db_session.commit()
    db_session.refresh(schedule)

    date = ScheduleDate(
        schedule_id=schedule.id,
        start_date=datetime.now(),
        end_date=datetime.now() + timedelta(hours=1),
    )
    db_session.add(date)
    db_session.commit()
    db_session.refresh(schedule)

    yield schedule

    db_session.delete(schedule)
    db_session.delete(category)
    db_session.commit()
