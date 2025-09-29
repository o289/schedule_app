from pydantic import BaseModel, validator, conlist
from uuid import UUID
from datetime import datetime
from typing import Optional, List
from app.schemas.category import CategoryBase

# --- サブクラス ---
class ScheduleDateBase(BaseModel):
    start_date: datetime 
    end_date: datetime 

    @validator("end_date")
    def check_dates(cls, v, values):
        if "start_date" in values and v <= values["start_date"]:
            raise ValueError("end_date must be after start_date")
        return v

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


# --- 本クラス ---
class ScheduleBase(BaseModel):
    title: Optional[str] = None
    note: Optional[str] = None
    category_id: Optional[UUID] = None

# --- 作成 ---
class ScheduleCreate(ScheduleBase):
    title: str
    dates: conlist(ScheduleDateBase, min_length=1)
    category_id: UUID

# --- 更新 ---
class ScheduleUpdate(ScheduleBase):
    dates: Optional[conlist(ScheduleDateBase, min_length=1)] = None


# --- レスポンス ---
class ScheduleResponse(ScheduleBase):
    id: UUID
    dates: List[ScheduleDateResponse] 
    category: CategoryBase  # ← レスポンス専用にネスト

    class Config:
        from_attributes = True

        