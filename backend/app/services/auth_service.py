# backend/app/services/passkey_service.py

from datetime import datetime, timedelta

import secrets

import base64
import json

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.core.security import create_access_token, create_refresh_token
from app.core.webauthn import (
    create_registration_options,
    verify_registration,
    create_authentication_options,
    verify_authentication,
)
from webauthn.helpers import options_to_json
from webauthn.helpers.structs import (
    PublicKeyCredentialDescriptor,
    PublicKeyCredentialType,
)

from app.crud.user import UserRepository
from app.crud.passkey import PasskeyRepository
from app.crud.challenge import ChallengeRepository

from app.schemas.auth import (
    PasskeyRegisterOptionsRequest,
    PasskeyRegisterOptionsResponse,
    PasskeyRegisterVerifyResponse,
    PasskeyLoginOptionsRequest,
    PasskeyLoginOptionsResponse,
    PasskeyLoginVerifyRequest,
    TokenResponse,
)
from app.schemas.challenge import ChallengeCreate
from app.schemas.passkey import PasskeyCreate
from app.core.api_error import BadRequestError, UnauthorizedError, ConflictError


class AuthService:
    def __init__(self, db: Session):
        self.db = db
        self.user_repo = UserRepository(db)
        self.passkey_repo = PasskeyRepository(db)
        self.challenge_repo = ChallengeRepository(db)

    # =========================
    # Register Options
    # =========================
    def register_options(
        self,
        payload: PasskeyRegisterOptionsRequest,
    ) -> PasskeyRegisterOptionsResponse:
        """
        register/options:
        - email正規化
        - user取得 or 作成
        - passkey既存確認
        - challenge生成
        - challenge保存
        - WebAuthn options生成
        - レスポンス返却
        """

        email = payload.email.strip().lower()

        # 1. user取得 or 作成
        user = self.user_repo.get_by_email(email)
        if not user:
            user = self.user_repo.create_user(email)

        # 3. challenge生成（secure random bytes使用）
        challenge_bytes = secrets.token_bytes(32)
        challenge_value = base64.urlsafe_b64encode(challenge_bytes).decode().rstrip("=")
        expires_at = datetime.utcnow() + timedelta(minutes=5)

        challenge_schema = ChallengeCreate(
            user_id=user.id,
            challenge=challenge_value,
            type="register",
            expires_at=expires_at,
        )

        # 4. challenge保存（既存削除含む）
        self.challenge_repo.create_or_replace(challenge_schema)

        # 既存passkey取得（excludeCredentials用）
        existing_passkeys = self.passkey_repo.get_by_user(user.id)
        exclude_credentials = []

        for pk in existing_passkeys:
            padding = "=" * (-len(pk.credential_id) % 4)
            credential_id_bytes = base64.urlsafe_b64decode(pk.credential_id + padding)

            exclude_credentials.append(
                PublicKeyCredentialDescriptor(
                    id=credential_id_bytes,
                    type=PublicKeyCredentialType.PUBLIC_KEY,
                )
            )

        # 5. WebAuthn options生成
        options = create_registration_options(
            user_id=str(user.id),
            email=email,
            challenge=challenge_bytes,
            exclude_credentials=exclude_credentials,
        )

        return PasskeyRegisterOptionsResponse(
            data={"publicKey": json.loads(options_to_json(options))}
        )

    # =========================
    # Register Verify
    # =========================
    def register_verify(
        self,
        payload,
    ):
        """
        register/verify:
        - challenge取得
        - challenge検証
        - origin検証
        - rp_id検証
        - attestation検証
        - credential_id保存
        - public_key保存
        - sign_count保存
        - 成否に関わらずchallenge削除
        - data: null返却
        """
        credential = payload.model_dump()

        # 1. credential_id 取得
        credential_id = payload.id

        # 2. passkey重複チェック
        existing = self.passkey_repo.get_by_credential_id(credential_id)
        if existing:
            raise ConflictError("PASSKEY_ALREADY_REGISTERED")

        """
        3. user取得（emailはclientDataJSONに含まれないためchallenge経由で特定）
        ここでは challenge から user を特定
        challenge は user_id ごとに保存されている前提
        payloadには user_id が無いので challenge で逆引きする

        3-1. 全challenge検索はせず、想定では1ユーザー1challengeなので
        credential.response.clientDataJSON 内 challenge と一致するものを取得
        ただし簡潔化のため user_id を別途APIで保持している前提とせず、
        challengeテーブルを全件検索しない設計とする

        ここでは「user_idをフロントで保持しない」仕様のため、
        challengeを user ごとに1件しか持たない前提で取得
        実際には login/register フローで user_id はセッション管理される想定

        現実装では challenge を user_id ごとに取得するため、
        事前に email をregister_optionsで確定している前提

        ここでは簡潔に:
        1ユーザー1challengeなので、payloadに紐づくuserは1人のみ
        challenge_repoを使って全件検索せず、サービス呼び出し側で
        user_idを渡す構造にするのが本来だが、現設計では
        「直前のregister_options実行ユーザー」が対象である前提

        安全設計のため:
        credential.response.clientDataJSONのchallengeを取り出し、
        DB上のchallengeと一致するuserを取得
        """

        encoded_client_data = payload.response["clientDataJSON"]
        padding = "=" * (-len(encoded_client_data) % 4)
        client_data_json = base64.urlsafe_b64decode(encoded_client_data + padding)
        client_data = json.loads(client_data_json)
        received_challenge = client_data.get("challenge")

        # challenge一致ユーザー検索（base64url文字列のまま比較）
        challenge_obj = self.challenge_repo.get_by_challenge(received_challenge)

        if not challenge_obj:
            raise BadRequestError("AUTH_INVALID_CHALLENGE")

        user_id = challenge_obj.user_id

        try:
            # 4. WebAuthn検証
            padding = "=" * (-len(challenge_obj.challenge) % 4)
            expected_challenge_bytes = base64.urlsafe_b64decode(
                challenge_obj.challenge + padding
            )

            verification = verify_registration(
                credential=credential,
                expected_challenge=expected_challenge_bytes,
            )

            # 5. Passkey保存
            passkey_schema = PasskeyCreate(
                user_id=user_id,
                credential_id=credential_id,
                public_key=base64.urlsafe_b64encode(
                    verification.credential_public_key
                ).decode(),
                sign_count=verification.sign_count,
                transports=None,
            )

            self.passkey_repo.create(passkey_schema)

        except ValueError():
            raise BadRequestError("PASSKEY_VERIFICATION_FAILED")

        finally:
            # 成否に関わらずchallenge削除
            self.challenge_repo.delete_by_user(user_id)

        return PasskeyRegisterVerifyResponse(data=None)

    # =========================
    # Login Options
    # =========================
    def login_options(
        self,
        payload,
    ):
        """
        login/options:
        - email正規化
        - user取得（未登録ならエラー）
        - passkey存在確認（未登録ならエラー）
        - challenge生成
        - challenge保存
        - allowCredentials生成
        - WebAuthn options生成
        - レスポンス返却
        """

        if not isinstance(payload, PasskeyLoginOptionsRequest):
            raise BadRequestError("INVALID_REQUEST")

        email = payload.email.strip().lower()

        # 1. user取得（未登録ならエラー）
        user = self.user_repo.get_by_email(email)
        if not user:
            raise BadRequestError("PASSKEY_NOT_FOUND")

        # 2. passkey存在確認
        passkeys = self.passkey_repo.get_by_user(user.id)
        if not passkeys:
            raise BadRequestError("PASSKEY_NOT_FOUND")

        # 3. challenge生成（secure random bytes使用）
        challenge_bytes = secrets.token_bytes(32)
        challenge_value = base64.urlsafe_b64encode(challenge_bytes).decode().rstrip("=")
        expires_at = datetime.utcnow() + timedelta(minutes=5)

        challenge_schema = ChallengeCreate(
            user_id=user.id,
            challenge=challenge_value,
            type="login",
            expires_at=expires_at,
        )

        # 4. challenge保存（既存削除含む）
        self.challenge_repo.create_or_replace(challenge_schema)

        # 5. allowCredentials生成
        allow_credentials = []
        for pk in passkeys:
            padding = "=" * (-len(pk.credential_id) % 4)
            credential_id_bytes = base64.urlsafe_b64decode(pk.credential_id + padding)

            allow_credentials.append(
                PublicKeyCredentialDescriptor(
                    id=credential_id_bytes,
                    type=PublicKeyCredentialType.PUBLIC_KEY,
                )
            )

        # 6. WebAuthn options生成
        options = create_authentication_options(
            challenge=challenge_bytes,
            allow_credentials=allow_credentials,
        )

        return PasskeyLoginOptionsResponse(
            data={"publicKey": json.loads(options_to_json(options))}
        )

    # =========================
    # Login Verify
    # =========================
    def login_verify(
        self,
        payload,
    ):
        """
        login/verify:
        - credential_id取得
        - passkey取得
        - challenge取得
        - challenge検証
        - origin/rp_id検証（webauthn側）
        - signature検証
        - sign_count比較（リプレイ防止）
        - sign_count更新
        - challenge削除
        - JWT発行
        - data: { access_token, refresh_token }
        """

        if not isinstance(payload, PasskeyLoginVerifyRequest):
            raise BadRequestError("INVALID_REQUEST")

        credential = payload.model_dump()
        credential_id = payload.id

        # 1. passkey取得
        passkey = self.passkey_repo.get_by_credential_id(credential_id)
        if not passkey:
            raise BadRequestError("PASSKEY_NOT_FOUND")

        # 2. challenge取得（user単位）
        challenge_obj = self.challenge_repo.get_by_user(passkey.user_id)
        if not challenge_obj:
            raise BadRequestError("AUTH_INVALID_CHALLENGE")

        # 3. challenge有効期限チェック
        if challenge_obj.expires_at < datetime.utcnow():
            self.challenge_repo.delete_by_user(passkey.user_id)
            raise BadRequestError("AUTH_INVALID_CHALLENGE")

        try:
            # 4. WebAuthn署名検証
            padding = "=" * (-len(passkey.public_key) % 4)
            public_key_bytes = base64.urlsafe_b64decode(passkey.public_key + padding)

            padding = "=" * (-len(challenge_obj.challenge) % 4)
            expected_challenge_bytes = base64.urlsafe_b64decode(
                challenge_obj.challenge + padding
            )

            verification = verify_authentication(
                credential=credential,
                expected_challenge=expected_challenge_bytes,
                credential_public_key=public_key_bytes,
                credential_current_sign_count=passkey.sign_count,
            )

            # 5. sign_count比較（リプレイ攻撃防止）
            new_sign_count = verification.new_sign_count

            # WebAuthn推奨: new_sign_count < stored の場合のみ不正
            if new_sign_count < passkey.sign_count:
                raise BadRequestError("PASSKEY_VERIFICATION_FAILED")

            # 6. sign_count更新
            self.passkey_repo.update_sign_count(
                passkey,
                new_sign_count,
            )

        except HTTPException:
            raise
        except Exception:
            raise BadRequestError("PASSKEY_VERIFICATION_FAILED")
        finally:
            # 成否に関わらずchallenge削除
            self.challenge_repo.delete_by_user(passkey.user_id)

        # 7. JWT発行（ここだけがログイン成立）
        access_token = create_access_token(data={"sub": str(passkey.user_id)})
        refresh_token = create_refresh_token(data={"sub": str(passkey.user_id)})

        # refresh_token保存
        user = self.user_repo.base_get(passkey.user_id)
        self.user_repo.update_refresh_token(user, refresh_token)

        return TokenResponse(
            data={
                "access_token": access_token,
                "refresh_token": refresh_token,
            }
        )

    # --- Refresh ---
    def refresh(self, refresh_token: str):
        user = self.user_repo.get_by_refresh_token(refresh_token)

        if not user:
            raise UnauthorizedError("INVALID_REFRESH_TOKEN")

        if user.refresh_token is None:
            raise UnauthorizedError("ALREADY_LOGGED_OUT")

        new_access_token = create_access_token(data={"sub": str(user.id)})

        return TokenResponse(
            data={
                "access_token": new_access_token,
                "refresh_token": refresh_token,
            }
        )

    # --- Logout ---
    def logout(self, refresh_token: str):
        user = self.user_repo.get_by_refresh_token(refresh_token)

        if not user:
            raise UnauthorizedError("INVALID_REFRESH_TOKEN")

        if user.refresh_token is None:
            raise UnauthorizedError("ALREADY_LOGGED_OUT")

        user.refresh_token = None
        self.db.commit()

        return None
