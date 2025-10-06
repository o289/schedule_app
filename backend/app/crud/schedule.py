from sqlalchemy.orm import Session
from .base import BaseRepository
from app.models.schedule import Schedule, ScheduleDate
from app.schemas.schedule import ScheduleCreate, ScheduleUpdate
from uuid import UUID


class ScheduleRepository(BaseRepository):
    def __init__(self, db: Session):
        super().__init__(db, Schedule)

    # --- 作成 ---
    def create(self, user_id: UUID, schedule_in: ScheduleCreate) -> Schedule:
        schedule = Schedule(
            title=schedule_in.title,
            note=schedule_in.note,
            dates=[
                ScheduleDate(start_date=d.start_date, end_date=d.end_date)
                for d in schedule_in.dates
            ],
            category_id=schedule_in.category_id,  # Enum → str
            user_id=user_id,
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

        update_data = schedule_in.model_dump(exclude={"id", "user_id", "dates"})

        for field, value in update_data.items():
            setattr(schedule, field, value)

        # --- datesの差分更新 ---
        if schedule_in.dates is not None:
            existing_dates = {d.id: d for d in schedule.dates}
            incoming_dates = {d.id: d for d in schedule_in.dates if d.id is not None}

            # スケジュールの更新
            for date_id, date_in in incoming_dates.items():
                if date_id in existing_dates:
                    existing = existing_dates[date_id]
                    if date_in.start_date is not None:
                        existing.start_date = date_in.start_date
                    if date_in.end_date is not None:
                        existing.end_date = date_in.end_date

            # 日にちの新規追加
            for date_in in schedule_in.dates:
                if date_in.id is None:
                    schedule.dates.append(
                        ScheduleDate(
                            start_date=date_in.start_date,
                            end_date=date_in.end_date,
                        )
                    )

            # 日にちの削除
            incoming_ids = {d.id for d in schedule_in.dates if d.id is not None}
            for existing in list(schedule.dates):
                if existing.id not in incoming_ids:
                    schedule.dates.remove(existing)

        return self.base_update(schedule)  # ここで commit + refresh 済み
