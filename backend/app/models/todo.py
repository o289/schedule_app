from app.core.database import BaseTable

from sqlalchemy import Column, String, ForeignKey, Date, DateTime, Boolean, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.core.database import BaseTable

import enum

# 色を固定 ENUM として定義
class Priority(str, enum.Enum):
    very_low = "very_low"
    low = "low"
    medium = "medium" 
    high = "high"
    very_high = "very_high"


class Todo(BaseTable):
    __tablename__ = "todos"

    schedule_id = Column(UUID(as_uuid=True), ForeignKey("schedules.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(200), nullable=False)
    is_done = Column(Boolean, default=False)
    done_at = Column(DateTime, nullable=True)

    priority = Column(Enum(Priority, name="todo_priority"), nullable=False, default=Priority.medium)
    due_date = Column(Date, nullable=True)

    # リレーション
    schedule = relationship("Schedule", back_populates="todos")