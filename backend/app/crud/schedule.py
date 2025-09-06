from sqlalchemy.orm import Session
from .base import BaseRepository
from app.models.schedule import Schedule
from app.schemas.schedule import ScheduleCreate, ScheduleUpdate
from uuid import UUID

class ScheduleRepository(BaseRepository):
    def __init__(self, db: Session):
        super().__init__(db, Schedule)

    # --- 作成 ---
    def create(self, user_id: UUID, schedule_in: ScheduleCreate) -> Schedule:
        schedule = Schedule(
            title=schedule_in.title,
            start_time=schedule_in.start_time,
            end_time=schedule_in.end_time,
            category_id=schedule_in.category_id,  # Enum → str
            note=schedule_in.note,
            user_id=user_id
        )
        return self.base_add(schedule)

    # --- 取得（ID指定） ---
    def get(self, schedule_id: UUID) -> Schedule | None:
        return self.base_get(schedule_id)
        
    # --- ユーザーの全スケジュール取得 ---
    def get_by_user(self, user_id: UUID) -> list[Schedule]:
        return self.base_list(user_id=user_id)

    # --- 削除 ---
    def delete(self, schedule_id: UUID, user_id: UUID) -> bool:
        obj = (
            self.db.query(Schedule)
            .filter(Schedule.id == schedule_id, Schedule.user_id == user_id)
            .first()
        )
        if not obj:
            return False
        return self.base_delete(obj)  # ← オブジェクトを渡す

    # --- 更新 ---
    def update(self, schedule_id: UUID, schedule_in: ScheduleUpdate) -> Schedule | None:
        schedule = self.get(schedule_id)
        if not schedule:
            return None

        update_data = schedule_in.model_dump(exclude={"id", "user_id"})
        for field, value in update_data.items():
            setattr(schedule, field, value)

        return self.base_update(schedule)  # ここで commit + refresh 済み