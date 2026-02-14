# backend/app/crud/challenge.py

from uuid import UUID
from sqlalchemy.orm import Session
from app.models.challenge import Challenge
from app.crud.base import BaseRepository
from app.schemas.challenge import ChallengeCreate  # ← 追加


class ChallengeRepository(BaseRepository):
    def __init__(self, db: Session):
        super().__init__(db, Challenge)

    # ---------------------------
    # 1ユーザー1challenge保証
    # ---------------------------
    def create_or_replace(
        self,
        schema_in: ChallengeCreate,
    ) -> Challenge | None:
        """
        既存challengeを削除し、新規作成
        UNIQUE(user_id)制約に対応
        """

        existing = (
            self.db.query(self.model)
            .filter(self.model.user_id == schema_in.user_id)
            .first()
        )

        if existing:
            self.base_delete(existing)

        obj = self.base_create_instance(self.model, schema_in)
        return self.base_add(obj)

    # ---------------------------
    # challenge取得
    # ---------------------------
    def get_by_user(self, user_id: UUID) -> Challenge | None:
        return self.db.query(self.model).filter(self.model.user_id == user_id).first()

    def get_by_challenge(self, challenge: str):
        return (
            self.db.query(self.model).filter(self.model.challenge == challenge).first()
        )

    # ---------------------------
    # challenge削除
    # ---------------------------
    def delete_by_user(self, user_id: UUID) -> bool:
        obj = self.get_by_user(user_id)
        return self.base_delete(obj)

    # ---------------------------
    # 期限切れ削除（任意）
    # ---------------------------
    def delete_expired(self) -> int:
        """
        expires_at < now のchallengeを削除
        """
        from datetime import datetime

        now = datetime.utcnow()

        expired = self.db.query(self.model).filter(self.model.expires_at < now).all()

        count = 0
        for obj in expired:
            if self.base_delete(obj):
                count += 1

        return count
