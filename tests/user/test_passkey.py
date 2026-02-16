from uuid import uuid4
import sys
import os

# /app を sys.path に追加
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.models.user import User
from app.models.challenge import Challenge
from app.models.passkey import Passkey

import json
import base64


# =========================
# Test: register/options
# =========================


def test_register_options_success(raw_client, db_session):
    """
    正常系:
    - 新規emailでregister/options実行
    - 200返却
    - publicKeyが含まれる
    - challengeがDB保存される
    - type="register"
    """

    email = f"test-{uuid4()}@example.com"

    res = raw_client.post(
        "/auth/passkey/register/options",
        json={"email": email},
    )

    assert res.status_code == 200
    body = res.json()

    assert "data" in body
    assert "publicKey" in body["data"]

    # DB確認
    user = db_session.query(User).filter(User.email == email).first()
    assert user is not None

    challenge = db_session.query(Challenge).filter(Challenge.user_id == user.id).first()

    assert challenge is not None
    assert challenge.type == "register"


def test_register_options_duplicate_passkey(raw_client, db_session):
    """
    異常系:
    - 既にpasskey登録済みユーザー
    - 409 PASSKEY_ALREADY_REGISTERED
    """

    email = f"test-{uuid4()}@example.com"

    # 事前にUser作成
    user = User(email=email)
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    credential_id = str(uuid4())
    passkey = Passkey(
        user_id=user.id,
        credential_id=credential_id,
        public_key=b"dummy",
        sign_count=1,
        transports=None,
    )
    db_session.add(passkey)
    db_session.commit()

    res = raw_client.post(
        "/auth/passkey/register/options",
        json={"email": email},
    )

    assert res.status_code == 409
    assert res.json()["code"] == "PASSKEY_ALREADY_REGISTERED"


# =========================
# Test: register/verify
# =========================


def test_register_verify_success(raw_client, db_session, monkeypatch):
    """
    正常系:
    - challenge事前生成
    - WebAuthn検証をMock
    - passkey保存確認
    - challenge削除確認
    """

    email = f"test-{uuid4()}@example.com"

    # ① register/options 実行して challenge生成
    raw_client.post(
        "/auth/passkey/register/options",
        json={"email": email},
    )

    user = db_session.query(User).filter(User.email == email).first()
    challenge = db_session.query(Challenge).filter(Challenge.user_id == user.id).first()

    assert challenge is not None

    # ② WebAuthn検証をMock
    class FakeRegistrationResult:
        credential_public_key = b"fake-public-key"
        sign_count = 1

    def fake_verify_registration(*args, **kwargs):
        return FakeRegistrationResult()

    monkeypatch.setattr(
        "app.services.auth_service.verify_registration",
        fake_verify_registration,
    )

    credential_id = str(uuid4())

    # ③ register/verify 実行
    challenge_json = json.dumps({"challenge": challenge.challenge}).encode()
    encoded = base64.urlsafe_b64encode(challenge_json).decode()
    attestation = base64.urlsafe_b64encode(b"dummy-attestation").decode()

    payload = {
        "id": credential_id,
        "rawId": credential_id,
        "response": {
            "clientDataJSON": encoded,
            "attestationObject": attestation,
        },
        "type": "public-key",
    }

    res = raw_client.post(
        "/auth/passkey/register/verify",
        json=payload,
    )

    assert res.status_code == 200
    assert res.json()["data"] is None

    saved_passkey = db_session.query(Passkey).filter(Passkey.user_id == user.id).first()

    assert saved_passkey is not None
    assert saved_passkey.credential_id == credential_id

    # ⑤ challenge削除確認
    deleted_challenge = (
        db_session.query(Challenge).filter(Challenge.user_id == user.id).first()
    )

    assert deleted_challenge is None


def test_register_verify_invalid_challenge(raw_client):
    """
    異常系:
    - challenge存在しない
    - 400 AUTH_INVALID_CHALLENGE
    """

    credential_id = str(uuid4())

    challenge_json = json.dumps({"challenge": "invalid"}).encode()
    encoded = base64.urlsafe_b64encode(challenge_json).decode()

    payload = {
        "id": credential_id,
        "rawId": credential_id,
        "response": {"clientDataJSON": encoded},
        "type": "public-key",
    }

    res = raw_client.post(
        "/auth/passkey/register/verify",
        json=payload,
    )

    assert res.status_code == 400
    assert res.json()["code"] == "AUTH_INVALID_CHALLENGE"


# =========================
# Test: login/options
# =========================


def test_login_options_success(raw_client, db_session):
    """
    正常系:
    - user存在
    - passkey存在
    - challenge生成
    - allowCredentials含まれる
    """

    email = f"test-{uuid4()}@example.com"

    # ① User作成
    user = User(email=email)
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    # ② Passkey事前登録
    credential_id = str(uuid4())
    passkey = Passkey(
        user_id=user.id,
        credential_id=credential_id,
        public_key=b"dummy",
        sign_count=1,
        transports=None,
    )
    db_session.add(passkey)
    db_session.commit()

    # ③ login/options 実行
    res = raw_client.post(
        "/auth/passkey/login/options",
        json={"email": email},
    )

    assert res.status_code == 200
    body = res.json()

    assert "data" in body
    assert "publicKey" in body["data"]

    # challenge生成確認
    challenge = db_session.query(Challenge).filter(Challenge.user_id == user.id).first()

    assert challenge is not None
    assert challenge.type == "login"


def test_login_options_user_not_found(raw_client):
    """
    異常系:
    - user存在しない
    - 400 PASSKEY_NOT_FOUND
    """

    email = f"test-{uuid4()}@example.com"

    res = raw_client.post(
        "/auth/passkey/login/options",
        json={"email": email},
    )

    assert res.status_code == 400
    assert res.json()["code"] == "PASSKEY_NOT_FOUND"


def test_login_options_passkey_not_found(raw_client, db_session):
    """
    異常系:
    - userは存在するがpasskey未登録
    - 400 PASSKEY_NOT_FOUND
    """

    email = f"test-{uuid4()}@example.com"

    # Userのみ作成
    user = User(email=email)
    db_session.add(user)
    db_session.commit()

    res = raw_client.post(
        "/auth/passkey/login/options",
        json={"email": email},
    )

    assert res.status_code == 400
    assert res.json()["code"] == "PASSKEY_NOT_FOUND"


# =========================
# Test: login/verify
# =========================


def test_login_verify_success(raw_client, db_session, monkeypatch):
    """
    正常系:
    - challenge事前生成
    - WebAuthn検証をMock
    - JWT返却確認
    - sign_count更新確認
    - challenge削除確認
    """

    email = f"test-{uuid4()}@example.com"

    # ① User作成
    user = User(email=email)
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    # ② Passkey事前登録
    credential_id = str(uuid4())
    passkey = Passkey(
        user_id=user.id,
        credential_id=credential_id,
        public_key=b"dummy",
        sign_count=1,
        transports=None,
    )
    db_session.add(passkey)
    db_session.commit()
    db_session.refresh(passkey)

    # ③ login/options 実行して challenge生成
    raw_client.post(
        "/auth/passkey/login/options",
        json={"email": email},
    )

    challenge = db_session.query(Challenge).filter(Challenge.user_id == user.id).first()
    assert challenge is not None

    # ④ WebAuthn検証をMock
    class FakeAuthenticationResult:
        new_sign_count = 2

    def fake_verify_authentication(*args, **kwargs):
        return FakeAuthenticationResult()

    monkeypatch.setattr(
        "app.services.auth_service.verify_authentication",
        fake_verify_authentication,
    )

    # ⑤ login/verify 実行
    challenge_json = json.dumps({"challenge": challenge.challenge}).encode()
    encoded = base64.urlsafe_b64encode(challenge_json).decode()

    payload = {
        "id": credential_id,
        "rawId": credential_id,
        "response": {
            "clientDataJSON": encoded,
            "authenticatorData": "dummy",
            "signature": "dummy",
        },
        "type": "public-key",
    }

    res = raw_client.post(
        "/auth/passkey/login/verify",
        json=payload,
    )

    assert res.status_code == 200
    body = res.json()

    assert "data" in body
    assert "access_token" in body["data"]
    assert "refresh_token" in body["data"]

    # ⑥ sign_count更新確認
    db_session.expire_all()
    updated_passkey = (
        db_session.query(Passkey).filter(Passkey.user_id == user.id).first()
    )

    assert updated_passkey.sign_count == 2

    # ⑦ challenge削除確認
    deleted_challenge = (
        db_session.query(Challenge).filter(Challenge.user_id == user.id).first()
    )

    assert deleted_challenge is None


def test_login_verify_sign_count_replay(raw_client, db_session, monkeypatch):
    """
    異常系:
    - new_sign_count <= current_sign_count
    - 400 PASSKEY_VERIFICATION_FAILED
    """

    email = f"test-{uuid4()}@example.com"

    # User作成
    user = User(email=email)
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    # Passkey登録（sign_count=2）
    credential_id = str(uuid4())
    passkey = Passkey(
        user_id=user.id,
        credential_id=credential_id,
        public_key=b"dummy",
        sign_count=2,
        transports=None,
    )
    db_session.add(passkey)
    db_session.commit()

    # challenge生成
    raw_client.post(
        "/auth/passkey/login/options",
        json={"email": email},
    )

    # Mock（new_sign_count=1 → リプレイ）
    class FakeAuthenticationResult:
        new_sign_count = 1

    def fake_verify_authentication(*args, **kwargs):
        return FakeAuthenticationResult()

    monkeypatch.setattr(
        "app.services.auth_service.verify_authentication",
        fake_verify_authentication,
    )

    challenge = db_session.query(Challenge).filter(Challenge.user_id == user.id).first()

    challenge_json = json.dumps({"challenge": challenge.challenge}).encode()
    encoded = base64.urlsafe_b64encode(challenge_json).decode()

    payload = {
        "id": credential_id,
        "rawId": credential_id,
        "response": {
            "clientDataJSON": encoded,
            "authenticatorData": "dummy",
            "signature": "dummy",
        },
        "type": "public-key",
    }

    res = raw_client.post(
        "/auth/passkey/login/verify",
        json=payload,
    )

    assert res.status_code == 400
    assert res.json()["code"] == "PASSKEY_VERIFICATION_FAILED"


# =========================
# Additional Coverage Tests
# =========================


def test_register_verify_duplicate_credential(raw_client, db_session, monkeypatch):
    """
    異常系:
    - 同一credential_idが既に存在
    - 409エラー
    """

    email = f"test-{uuid4()}@example.com"

    # register/options
    raw_client.post(
        "/auth/passkey/register/options",
        json={"email": email},
    )

    user = db_session.query(User).filter(User.email == email).first()
    challenge = db_session.query(Challenge).filter(Challenge.user_id == user.id).first()

    # 既存passkey作成
    credential_id = str(uuid4())
    existing = Passkey(
        user_id=user.id,
        credential_id=credential_id,
        public_key=b"dummy",
        sign_count=1,
        transports=None,
    )
    db_session.add(existing)
    db_session.commit()

    class FakeRegistrationResult:
        credential_public_key = b"fake"
        sign_count = 1

    def fake_verify_registration(*args, **kwargs):
        return FakeRegistrationResult()

    monkeypatch.setattr(
        "app.core.webauthn.verify_registration",
        fake_verify_registration,
    )

    challenge_json = json.dumps({"challenge": challenge.challenge}).encode()
    encoded = base64.urlsafe_b64encode(challenge_json).decode()
    attestation = base64.urlsafe_b64encode(b"dummy-attestation").decode()

    payload = {
        "id": credential_id,
        "rawId": credential_id,
        "response": {
            "clientDataJSON": encoded,
            "attestationObject": attestation,
        },
        "type": "public-key",
    }

    res = raw_client.post("/auth/passkey/register/verify", json=payload)

    assert res.status_code == 409


def test_login_verify_challenge_not_found(raw_client, db_session):
    """
    異常系:
    - challenge存在しない
    - 400
    """

    email = f"test-{uuid4()}@example.com"

    user = User(email=email)
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    credential_id = str(uuid4())
    passkey = Passkey(
        user_id=user.id,
        credential_id=credential_id,
        public_key=b"dummy",
        sign_count=1,
        transports=None,
    )
    db_session.add(passkey)
    db_session.commit()

    challenge_json = json.dumps({"challenge": "invalid"}).encode()
    encoded = base64.urlsafe_b64encode(challenge_json).decode()

    payload = {
        "id": credential_id,
        "rawId": credential_id,
        "response": {
            "clientDataJSON": encoded,
            "authenticatorData": "dummy",
            "signature": "dummy",
        },
        "type": "public-key",
    }

    res = raw_client.post("/auth/passkey/login/verify", json=payload)

    assert res.status_code == 400


def test_refresh_success(raw_client, db_session):
    """
    正常系:
    - 有効refresh_tokenでaccess_token再発行
    """

    email = f"test-{uuid4()}@example.com"

    user = User(email=email, refresh_token="valid-token")
    db_session.add(user)
    db_session.commit()

    res = raw_client.post(
        "/auth/refresh",
        json={"refresh_token": "valid-token"},
    )

    assert res.status_code == 200
    assert "access_token" in res.json()["data"]
