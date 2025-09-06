from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional
from app.schemas.category import CategoryBase

# --- 共通 ---
class ScheduleBase(BaseModel):
    title: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    note: Optional[str] = None
    category_id: Optional[UUID] = None


# --- 作成 ---
class ScheduleCreate(BaseModel):
    title: str
    start_time: datetime
    end_time: datetime
    category_id: UUID
    note: Optional[str] = None


# --- 更新 ---
class ScheduleUpdate(ScheduleBase):
    pass  # すべてOptionalなので部分更新対応


# --- レスポンス ---
class ScheduleResponse(ScheduleBase):
    id: UUID
    category: CategoryBase  # ← レスポンス専用にネスト

    class Config:
        from_attributes = True