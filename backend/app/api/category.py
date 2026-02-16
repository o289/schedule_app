from fastapi import APIRouter, status, Response
from uuid import UUID

from app.api.deps import CurrentUser, SessionDep
from app.schemas.category import (
    CategoryCreate,
    CategoryUpdate,
    CategoryResponse,
)
from app.services.category_service import CategoryService

router = APIRouter(prefix="/categories", tags=["categories"])


# --- 一覧 ---
@router.get("/", response_model=list[CategoryResponse])
def list_categories(
    db: SessionDep,
    current_user: CurrentUser,
):
    service = CategoryService(db)
    return service.list_categories(current_user)


# --- 作成 ---
@router.post("/", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(
    category_in: CategoryCreate,
    db: SessionDep,
    current_user: CurrentUser,
):
    service = CategoryService(db)
    return service.create_category(current_user, category_in)


# --- 更新 ---
@router.put("/{category_id}", response_model=CategoryResponse)
def update_category(
    category_id: UUID,
    category_in: CategoryUpdate,
    db: SessionDep,
    current_user: CurrentUser,
):
    service = CategoryService(db)
    return service.update_category(
        current_user,
        category_id,
        category_in,
    )


# --- 削除 ---
@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(
    category_id: UUID,
    db: SessionDep,
    current_user: CurrentUser,
):
    service = CategoryService(db)
    service.delete_category(current_user, category_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
