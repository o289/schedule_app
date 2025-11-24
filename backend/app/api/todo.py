from fastapi import APIRouter, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID

from app.models.user import User
from app.models.schedule import Schedule
from app.schemas.todo import TodoCreate, TodoUpdate, TodoResponse
from app.crud.todo import TodoRepository
from app.api.deps import CurrentUser, SessionDep

router = APIRouter(prefix="/schedules/{schedule_id}/todos", tags=["todos"])


# --- スケジュールに紐づく Todo 一覧取得 ---
@router.get("/", response_model=list[TodoResponse])
def list_todos(
    schedule_id: UUID,
    db: SessionDep,
    current_user: CurrentUser,
):

    schedule = db.query(Schedule).filter(Schedule.id == schedule_id).first()
    if not schedule or schedule.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="権限がありません")

    repo = TodoRepository(db)
    return repo.get_by_schedule(schedule_id)


# --- Todo 作成 ---
@router.post("/", response_model=TodoResponse, status_code=status.HTTP_201_CREATED)
def create_todo(
    schedule_id: UUID,
    todo_in: TodoCreate,
    db: SessionDep,
    current_user: CurrentUser,
):
    schedule = db.query(Schedule).filter(Schedule.id == schedule_id).first()
    if not schedule or schedule.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="権限がありません")

    repo = TodoRepository(db)
    return repo.create(todo_in, schedule_id)


# --- Todo 更新 ---
@router.put("/{todo_id}", response_model=TodoResponse)
def update_todo(
    todo_id: UUID,
    todo_in: TodoUpdate,
    db: SessionDep,
    current_user: CurrentUser,
):
    repo = TodoRepository(db)
    todo_item = repo.get(todo_id)
    if not todo_item:
        raise HTTPException(status_code=404, detail="このTodoはありません")

    if todo_item.schedule.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="権限がありません")

    todo = repo.update(todo_id, todo_in)

    if not todo:
        raise HTTPException(status_code=500, detail="更新に失敗しました")

    return todo


# --- Todo 削除 ---
@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(
    todo_id: UUID,
    db: SessionDep,
    current_user: CurrentUser,
):
    repo = TodoRepository(db)

    todo = repo.get(todo_id)

    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")

    # 所属するスケジュールのユーザーが自分か確認
    if todo.schedule.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="権限がありません")

    repo.delete(todo_id=todo_id)

    return None
