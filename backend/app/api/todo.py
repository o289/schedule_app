from fastapi import APIRouter, status, Response
from uuid import UUID

from app.api.deps import CurrentUser, SessionDep
from app.schemas.todo import TodoCreate, TodoUpdate, TodoResponse
from app.services.todo_service import TodoService

router = APIRouter(
    prefix="/schedules/{schedule_id}/todos",
    tags=["todos"],
)


# --- スケジュール配下 Todo 一覧 ---
@router.get("/", response_model=list[TodoResponse])
def list_todos(
    schedule_id: UUID,
    db: SessionDep,
    current_user: CurrentUser,
):
    service = TodoService(db)
    return service.list_todos(current_user, schedule_id)


# --- Todo 作成 ---
@router.post(
    "/",
    response_model=TodoResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_todo(
    schedule_id: UUID,
    todo_in: TodoCreate,
    db: SessionDep,
    current_user: CurrentUser,
):
    service = TodoService(db)
    return service.create_todo(
        current_user,
        schedule_id,
        todo_in,
    )


# --- Todo 更新 ---
@router.put("/{todo_id}", response_model=TodoResponse)
def update_todo(
    todo_id: UUID,
    todo_in: TodoUpdate,
    db: SessionDep,
    current_user: CurrentUser,
):
    service = TodoService(db)
    return service.update_todo(
        current_user,
        todo_id,
        todo_in,
    )


# --- Todo 削除 ---
@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(
    todo_id: UUID,
    db: SessionDep,
    current_user: CurrentUser,
):
    service = TodoService(db)
    service.delete_todo(current_user, todo_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
