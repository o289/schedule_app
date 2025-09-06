from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.schedule import ScheduleCreate, ScheduleUpdate, ScheduleResponse
from app.crud.schedule import ScheduleRepository

router = APIRouter(prefix="/schedules", tags=["schedules"])


# --- 作成 ---
@router.post("/", response_model=ScheduleResponse, status_code=status.HTTP_201_CREATED)
def create_schedule(
    schedule_in: ScheduleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    repo = ScheduleRepository(db)
    # user_id を渡すことで他人のカテゴリに紐づけられないよう制御できる
    
    schedule = repo.create(current_user.id,schedule_in)
    return schedule


# --- 一覧取得（ログインユーザーのスケジュールのみ） ---
@router.get("/", response_model=list[ScheduleResponse])
def list_schedules(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    repo = ScheduleRepository(db)
    return repo.get_by_user(current_user.id)


# --- 詳細取得 ---
@router.get("/{schedule_id}", response_model=ScheduleResponse)
def get_schedule(
    schedule_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    repo = ScheduleRepository(db)
    schedule = repo.get(schedule_id)
    if not schedule or schedule.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="スケジュールが見つかりません")
    return schedule


# --- 更新（PUT 全更新） ---
@router.put("/{schedule_id}", response_model=ScheduleResponse)
def update_schedule(
    schedule_id: UUID,
    schedule_in: ScheduleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    repo = ScheduleRepository(db)
    schedule = repo.get(schedule_id)
    if not schedule or schedule.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="スケジュールが見つかりません")
    return repo.update(schedule_id, schedule_in)


# --- 削除 ---
@router.delete("/{schedule_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_schedule(
    schedule_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    repo = ScheduleRepository(db)
    success = repo.delete(schedule_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="スケジュールが見つかりません")
    return None