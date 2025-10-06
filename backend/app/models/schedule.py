from sqlalchemy import Column, String, ForeignKey, DateTime, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.core.database import BaseTable


class Schedule(BaseTable):
    __tablename__ = "schedules"

    title = Column(String(50), nullable=False)
    note = Column(String, nullable=True)

    # 子テーブル: 複数日を保持
    dates = relationship(
        "ScheduleDate", back_populates="schedule", cascade="all, delete-orphan"
    )

    category_id = Column(
        UUID(as_uuid=True), ForeignKey("categories.id"), nullable=False
    )
    category = relationship("Category", back_populates="schedules")

    user_id = Column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    user = relationship("User", back_populates="schedules")

    todos = relationship("Todo", back_populates="schedule", cascade="all, delete")


class ScheduleDate(BaseTable):
    __tablename__ = "schedule_dates"

    schedule_id = Column(UUID(as_uuid=True), ForeignKey("schedules.id"), nullable=False)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)

    __table_args__ = (
        CheckConstraint("end_date >= start_date", name="chk_end_after_start"),
    )

    schedule = relationship("Schedule", back_populates="dates")
