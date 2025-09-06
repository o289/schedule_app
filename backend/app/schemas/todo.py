from pydantic import BaseModel
from uuid import UUID
from datetime import date, datetime
from typing import Optional
from app.models.todo import Priority

class TodoBase(BaseModel):
    title: str
    is_done: bool = False
    priority: Priority = Priority.medium
    due_date: Optional[date] = None

class TodoCreate(TodoBase):
    pass

class TodoUpdate(BaseModel):
    title: Optional[str] = None
    is_done: Optional[bool] = None
    priority: Optional[Priority] = None
    due_date: Optional[date] = None

class TodoResponse(TodoBase):
    id: UUID
    done_at: Optional[datetime] = None

    class Config:
        from_attributes = True