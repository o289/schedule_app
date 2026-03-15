from uuid import UUID
from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.schedule import ScheduleCreate, ScheduleUpdate
from app.crud.schedule import ScheduleRepository
from app.crud.category import CategoryRepository

from app.core.api_error import BadRequestError, NotFoundError


class ScheduleService:
    def __init__(self, db: Session):
        self.repo = ScheduleRepository(db)
        self.category_repo = CategoryRepository(db)

    def _validate_dates(self, dates):
        for d in dates:
            if d.end_date <= d.start_date:
                raise BadRequestError("INVALID_TIME")

    # --- 作成 ---
    def create_schedule(self, user: User, schedule_in: ScheduleCreate):
        self._validate_dates(schedule_in.dates)
        category = self.category_repo.get(schedule_in.category_id)
        if not category or category.user_id != user.id:
            raise NotFoundError("NOT_FOUND_CATEGORY")
        return self.repo.create(user.id, schedule_in)

    # --- 一覧取得 ---
    def list_schedules(self, user: User):
        return self.repo.get_by_user(user.id)

    # --- 詳細取得 ---
    def get_schedule(self, user: User, schedule_id: UUID):
        schedule = self.repo.get(schedule_id)

        if not schedule or schedule.user_id != user.id:
            raise NotFoundError("NOT_FOUND_SCHEDULE")
        return schedule

    # --- 更新 ---
    def update_schedule(
        self,
        user: User,
        schedule_id: UUID,
        schedule_in: ScheduleUpdate,
    ):
        schedule = self.repo.get(schedule_id)

        if not schedule or schedule.user_id != user.id:
            raise NotFoundError("NOT_FOUND_SCHEDULE")

        if schedule_in.dates is not None:
            self._validate_dates(schedule_in.dates)
        else:
            schedule_in = schedule_in.copy(exclude={"dates"})

        if schedule_in.category_id is not None:
            category = self.category_repo.get(schedule_in.category_id)
            if not category or category.user_id != user.id:
                raise NotFoundError("NOT_FOUND_CATEGORY")
        else:
            schedule_in = schedule_in.copy(exclude={"category_id"})

        return self.repo.update(schedule_id, schedule_in)

    # --- 削除 ---
    def delete_schedule(self, user: User, schedule_id: UUID):
        success = self.repo.delete(schedule_id, user.id)

        if not success:
            raise NotFoundError("NOT_FOUND_SCHEDULE")

        return None
