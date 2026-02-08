from uuid import UUID
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.user import User
from app.models.schedule import Schedule
from app.schemas.todo import TodoCreate, TodoUpdate
from app.crud.todo import TodoRepository


class TodoService:
    def __init__(self, db: Session):
        self.repo = TodoRepository(db)
        self.db = db

    # --- スケジュール配下 Todo 一覧 ---
    def list_todos(self, user: User, schedule_id: UUID):
        schedule = self.db.query(Schedule).filter(Schedule.id == schedule_id).first()

        if not schedule or schedule.user_id != user.id:
            raise HTTPException(
                status_code=403,
                detail={"code": "FORBIDDEN_SCHEDULE"},
            )

        return self.repo.get_by_schedule(schedule_id)

    # --- Todo 作成 ---
    def create_todo(
        self,
        user: User,
        schedule_id: UUID,
        todo_in: TodoCreate,
    ):
        schedule = self.db.query(Schedule).filter(Schedule.id == schedule_id).first()

        if not schedule or schedule.user_id != user.id:
            raise HTTPException(
                status_code=403,
                detail={"code": "FORBIDDEN_SCHEDULE"},
            )

        return self.repo.create(todo_in, schedule_id)

    # --- Todo 更新 ---
    def update_todo(
        self,
        user: User,
        todo_id: UUID,
        todo_in: TodoUpdate,
    ):
        todo = self.repo.get(todo_id)

        if not todo:
            raise HTTPException(
                status_code=404,
                detail={"code": "NOT_FOUND_TODO"},
            )

        if todo.schedule.user_id != user.id:
            raise HTTPException(
                status_code=403,
                detail={"code": "FORBIDDEN_TODO"},
            )

        updated = self.repo.update(todo_id, todo_in)

        if not updated:
            raise HTTPException(
                status_code=500,
                detail={"code": "TODO_UPDATE_FAILED"},
            )

        return updated

    # --- Todo 削除 ---
    def delete_todo(
        self,
        user: User,
        todo_id: UUID,
    ):
        todo = self.repo.get(todo_id)

        if not todo:
            raise HTTPException(
                status_code=404,
                detail={"code": "NOT_FOUND_TODO"},
            )

        if todo.schedule.user_id != user.id:
            raise HTTPException(
                status_code=403,
                detail={"code": "FORBIDDEN_TODO"},
            )

        self.repo.delete(todo_id)
        return None
