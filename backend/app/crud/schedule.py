from sqlalchemy.orm import Session
from .base import BaseRepository
from app.models.schedule import Schedule, ScheduleDate
from app.schemas.schedule import ScheduleCreate, ScheduleUpdate
from uuid import UUID


class ScheduleRepository(BaseRepository):
    def __init__(self, db: Session):
        super().__init__(db, Schedule)

    # --- 作成 ---
    # スケジュールの予定はdatesモデルも絡んでいるため、base_create_instanceの導入は見送り
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
    """
    使用しているロジックが多いので複数に分割する
    """

    def _update_schedule_fields(self, schedule: Schedule, schedule_in: ScheduleUpdate):
        self.base_apply_schema(
            obj=schedule, schema_in=schedule_in, exclude={"id", "user_id", "dates"}
        )

    def _update_schedule_dates(
        self, schedule: Schedule, schedule_in: ScheduleUpdate, schedule_id: UUID
    ):
        # --- ② 日付データの更新処理 ---
        existing_dates = {d.id: d for d in schedule.dates}  # DB上の既存日付
        incoming_dates = {
            d.id: d for d in schedule_in.dates if d.id
        }  # リクエスト日付（idあり）

        # 1️⃣ 更新・追加
        for date_id, date_in in incoming_dates.items():
            if date_id in existing_dates:
                existing_date = existing_dates[date_id]
                self.base_apply_schema(obj=existing_date, schema_in=date_in)

            else:
                # 新規追加
                # --- 💡 新しいScheduleDateインスタンスを作成し、ORMで追跡させる ---
                new_date = ScheduleDate(
                    schedule_id=schedule_id,
                    start_date=date_in.start_date,
                    end_date=date_in.end_date,
                )
                # begin() ブロックを削除しました。理由：
                # ここでトランザクションを開始すると、既に外部でトランザクションが開始されている場合に
                # 二重トランザクションエラーが発生するためです。
                # 代わりに、単純に add() を呼び出すことで、既存のトランザクション内で処理されます。
                self.db.add(new_date)  # セッションに追加し

                schedule.dates.append(new_date)  # ORM的にも関連付ける

                # ✅ B. 削除された日付を削除
        to_delete_ids = set(existing_dates.keys()) - set(incoming_dates.keys())
        for date_id in to_delete_ids:
            self.db.delete(existing_dates[date_id])

        # ✅ C. 新規に追加されたidが無い（完全新規）ケースもケア
        new_dates_without_id = [
            d for d in schedule_in.dates if not getattr(d, "id", None)
        ]
        for d in new_dates_without_id:
            # --- 💡 新しいScheduleDateインスタンスを作成し、ORMで追跡させる ---
            new_date = ScheduleDate(
                schedule_id=schedule_id,
                start_date=d.start_date,
                end_date=d.end_date,
            )
            # begin() ブロックを削除しました。理由：
            # ここでトランザクションを開始すると、既に外部でトランザクションが開始されている場合に
            # 二重トランザクションエラーが発生するためです。
            # 代わりに、単純に add() を呼び出すことで、既存のトランザクション内で処理されます。
            self.db.add(new_date)

            schedule.dates.append(new_date)  # ORM的にも関連付ける

    #  --- 実際に使用するアップデート ---
    def update(self, schedule_id: UUID, schedule_in: ScheduleUpdate) -> Schedule | None:
        """
        スケジュールの更新処理。
        - タイトル、メモ、カテゴリなどの基本情報を更新
        - dates配列の内容に応じて、ScheduleDateを追加・更新・削除
        """

        schedule = self.get(schedule_id)
        if not schedule:
            return None

        self._update_schedule_fields(schedule=schedule, schedule_in=schedule_in)
        self._update_schedule_dates(
            schedule=schedule, schedule_in=schedule_in, schedule_id=schedule_id
        )

        # --- ③ コミット・リフレッシュ ---
        # base_update() 内で commit + refresh を実行しているため、ここでは不要。
        return self.base_update(schedule)
