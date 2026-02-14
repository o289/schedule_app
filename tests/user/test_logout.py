import sys
import os
from uuid import uuid4

# /app を sys.path に追加
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.models.user import User


# =========================
# Test: logout
# =========================


def test_logout_success(raw_client, db_session):
    """
    正常系:
    - 有効なrefresh_tokenでlogout成功
    - DB上のrefresh_tokenがNoneになる
    """

    email = f"test-{uuid4()}@example.com"

    # ① User作成（refresh_token付き）
    user = User(email=email, refresh_token="valid-logout-token")
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    # ② logout実行
    res = raw_client.post(
        "/auth/logout",
        json={"refresh_token": "valid-logout-token"},
    )

    assert res.status_code == 204
    assert res.content == b""

    # ③ refresh_token削除確認
    db_session.expire_all()
    updated_user = db_session.query(User).filter(User.id == user.id).first()
    assert updated_user.refresh_token is None


def test_logout_invalid_token(raw_client):
    """
    異常系:
    - 無効なrefresh_token
    - 401 INVALID_REFRESH_TOKEN
    """

    res = raw_client.post(
        "/auth/logout",
        json={"refresh_token": "invalid-token"},
    )

    assert res.status_code == 401
    assert res.json()["code"] == "INVALID_REFRESH_TOKEN"
