from fastapi import APIRouter, status
from uuid import UUID

from app.api.deps import CurrentUser, SessionDep
from app.schemas.schedule import (
    ScheduleCreate,
    ScheduleUpdate,
    ScheduleResponse,
)
from app.services.schedule_service import ScheduleService

router = APIRouter(prefix="/schedules", tags=["schedules"])


# --- 作成 ---
@router.post("/", response_model=ScheduleResponse, status_code=status.HTTP_201_CREATED)
def create_schedule(
    schedule_in: ScheduleCreate,
    db: SessionDep,
    current_user: CurrentUser,
):
    service = ScheduleService(db)
    return service.create_schedule(current_user, schedule_in)


# --- 一覧取得 ---
@router.get("/", response_model=list[ScheduleResponse])
def list_schedules(
    db: SessionDep,
    current_user: CurrentUser,
):
    service = ScheduleService(db)
    return service.list_schedules(current_user)


# --- 詳細取得 ---
@router.get("/{schedule_id}", response_model=ScheduleResponse)
def get_schedule(
    schedule_id: UUID,
    db: SessionDep,
    current_user: CurrentUser,
):
    service = ScheduleService(db)
    return service.get_schedule(current_user, schedule_id)


# --- 更新 ---
@router.put("/{schedule_id}", response_model=ScheduleResponse)
def update_schedule(
    schedule_id: UUID,
    schedule_in: ScheduleUpdate,
    db: SessionDep,
    current_user: CurrentUser,
):
    service = ScheduleService(db)
    return service.update_schedule(
        current_user,
        schedule_id,
        schedule_in,
    )


# --- 削除 ---
@router.delete("/{schedule_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_schedule(
    schedule_id: UUID,
    db: SessionDep,
    current_user: CurrentUser,
):
    service = ScheduleService(db)
    service.delete_schedule(current_user, schedule_id)
    return None
