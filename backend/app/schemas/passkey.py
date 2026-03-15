# backend/app/schemas/passkey.py

from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional


class PasskeyCreate(BaseModel):
    """
    DB保存専用スキーマ
    Service層からCRUDへ渡す用途
    """

    user_id: UUID
    credential_id: str
    public_key: str
    sign_count: int
    transports: Optional[str] = None


class PasskeyResponse(BaseModel):
    """
    DBから取得したPasskeyを返す場合用
    """

    id: UUID
    user_id: UUID
    credential_id: str
    public_key: str
    sign_count: int
    transports: Optional[str]
    created_at: datetime
    last_used_at: Optional[datetime]

    class Config:
        from_attributes = True
