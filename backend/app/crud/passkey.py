# backend/app/crud/passkey.py

from uuid import UUID
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.passkey import Passkey
from app.crud.base import BaseRepository
from app.schemas.passkey import PasskeyCreate


class PasskeyRepository(BaseRepository):
    def __init__(self, db: Session):
        super().__init__(db, Passkey)

    # ---------------------------
    # 新規登録（register/verify用）
    # ---------------------------
    def create(self, schema_in: PasskeyCreate) -> Passkey | None:
        obj = self.base_create_instance(self.model, schema_in)
        return self.base_add(obj)

    # ---------------------------
    # credential_idで取得（verify/login用）
    # ---------------------------
    def get_by_credential_id(self, credential_id: str) -> Passkey | None:
        return (
            self.db.query(self.model)
            .filter(self.model.credential_id == credential_id)
            .first()
        )

    # ---------------------------
    # user_idで取得
    # ---------------------------
    def get_by_user(self, user_id: UUID) -> list[Passkey]:
        return self.db.query(self.model).filter(self.model.user_id == user_id).all()

    # ---------------------------
    # sign_count更新（login成功時）
    # ---------------------------
    def update_sign_count(
        self,
        passkey: Passkey,
        new_sign_count: int,
    ) -> Passkey | None:
        passkey.sign_count = new_sign_count
        passkey.last_used_at = datetime.utcnow()

        return self.base_update(passkey)
