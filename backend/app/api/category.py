from fastapi import APIRouter, HTTPException, status, Response
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from uuid import UUID

from app.api.deps import CurrentUser, SessionDep
from app.crud.category import CategoryRepository
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse
from app.models.user import User

router = APIRouter(prefix="/categories", tags=["categories"])


# --- 一覧 ---
@router.get("/", response_model=list[CategoryResponse])
def list_categories(
    db: Session = SessionDep,
    current_user: User = CurrentUser,
):
    repo = CategoryRepository(db)
    return repo.get_by_user(user_id=current_user.id)


# --- 作成 ---
@router.post("/", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(
    category_in: CategoryCreate,
    db: Session = SessionDep,
):
    repo = CategoryRepository(db)
    return repo.create(category_in=category_in)


# --- 更新 ---
@router.put("/{category_id}", response_model=CategoryResponse)
def update_category(
    category_id: UUID,
    category_in: CategoryUpdate,
    db: Session = SessionDep,
    current_user: User = CurrentUser,
):
    repo = CategoryRepository(db)
    category = repo.get(category_id)

    if not category or category.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="カテゴリが見つかりません")

    return repo.update(category_id, category_in)


# --- 削除 ---
@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(
    category_id: UUID,
    db: Session = SessionDep,
    current_user: User = CurrentUser,
):
    repo = CategoryRepository(db)
    category = repo.get(category_id)

    if not category or category.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="カテゴリが見つかりません")

    try:
        repo.delete(category_id, current_user.id)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="このカテゴリにはスケジュールが存在するため削除できません",
        )

    return Response(status_code=status.HTTP_204_NO_CONTENT)
