from sqlalchemy.orm import Session
from .base import BaseRepository
from app.models.todo import Todo
from app.schemas.todo import TodoCreate, TodoUpdate
from uuid import UUID
from datetime import datetime


class TodoRepository(BaseRepository):
    def __init__(self, db: Session):
        super().__init__(db, Todo)

    # --- 作成 ---
    def create(self, schedule_id: UUID, todo_in: TodoCreate) -> Todo:
        todo = Todo(
            title=todo_in.title,
            is_done=todo_in.is_done,
            priority=todo_in.priority,
            due_date=todo_in.due_date,
            schedule_id=schedule_id,
        )
        return self.base_add(todo)

    # --- 取得（ID指定） ---
    def get(self, todo_id: UUID) -> Todo | None:
        return self.base_get(todo_id)

    # --- ユーザーの全スケジュール取得 ---
    def get_by_schedule(self, schedule_id: UUID) -> list[Todo]:
        return self.base_list(schedule_id=schedule_id)

    # --- 削除 ---
    def delete(self, todo_id: UUID) -> bool:
        obj = self.db.query(Todo).filter(Todo.id == todo_id).first()
        if not obj:
            return False
        return self.base_delete(obj)  # ← オブジェクトを渡す

    # --- 更新 ---
    def update(self, todo_id: UUID, schedule_in: TodoUpdate) -> Todo | None:
        todo = self.get(todo_id)
        if not todo:
            return None

        update_data = schedule_in.model_dump(exclude_unset=True)

        # 現場todoはis_done以外にフィールドの変更ができない状態のでここのbase_apply_schemaの適用を除外
        for field, value in update_data.items():
            if field == "is_done":
                todo.is_done = value
                todo.done_at = datetime.utcnow() if value else None
            else:
                setattr(todo, field, value)

        return self.base_update(todo)  # ここで commit + refresh 済み
