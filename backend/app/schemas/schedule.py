from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional, List
from app.schemas.category import CategoryBase

# --- サブクラス ---
class ScheduleDateBase(BaseModel):
    start_date: datetime 
    end_date: datetime 

class ScheduleDateCreate(ScheduleDateBase):
    pass
class ScheduleDateUpdate(BaseModel):
    id: Optional[UUID] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None

class ScheduleDateResponse(ScheduleDateBase):
    id: UUID
    class Config:
        from_attributes = True


# --- 共通 ---
class ScheduleBase(BaseModel):
    title: Optional[str] = None
    note: Optional[str] = None
    category_id: Optional[UUID] = None

# --- 作成 ---
class ScheduleCreate(ScheduleBase):
    title: str
    dates: List[ScheduleDateCreate]
    category_id: UUID

# --- 更新 ---
class ScheduleUpdate(ScheduleBase):
    dates: Optional[List[ScheduleDateUpdate]] = None


# --- レスポンス ---
class ScheduleResponse(ScheduleBase):
    id: UUID
    dates: List[ScheduleDateResponse] = []
    category: CategoryBase  # ← レスポンス専用にネスト

    class Config:
        from_attributes = True