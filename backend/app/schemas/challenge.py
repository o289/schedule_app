# backend/app/schemas/challenge.py

from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Literal


class ChallengeCreate(BaseModel):
    """
    DB保存専用スキーマ
    Service層からCRUDへ渡す用途
    """

    user_id: UUID
    challenge: str
    type: Literal["register", "login"]
    expires_at: datetime


class ChallengeResponse(BaseModel):
    """
    DBから取得したChallengeを返す場合用
    """

    id: UUID
    user_id: UUID
    challenge: str
    type: str
    expires_at: datetime

    class Config:
        from_attributes = True
