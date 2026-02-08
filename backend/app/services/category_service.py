from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException

from app.crud.category import CategoryRepository
from app.schemas.category import CategoryCreate, CategoryUpdate
from app.models.user import User


class CategoryService:
    def __init__(self, db: Session):
        self.repo = CategoryRepository(db)

    # --- 一覧取得 ---
    def list_categories(self, user: User):
        return self.repo.get_by_user(user_id=user.id)

    # --- 作成 ---
    def create_category(self, user: User, category_in: CategoryCreate):
        return self.repo.create(
            category_in=category_in,
            user_id=user.id,
        )

    # --- 更新 ---
    def update_category(
        self,
        user: User,
        category_id: UUID,
        category_in: CategoryUpdate,
    ):
        category = self.repo.get(category_id)

        if not category or category.user_id != user.id:
            raise HTTPException(
                status_code=404,
                detail={"code": "NOT_FOUND_CATEGORY"},
            )

        return self.repo.update(category_id, category_in)

    # --- 削除 ---
    def delete_category(
        self,
        user: User,
        category_id: UUID,
    ):
        category = self.repo.get(category_id)

        if not category or category.user_id != user.id:
            raise HTTPException(
                status_code=404,
                detail={"code": "NOT_FOUND_CATEGORY"},
            )

        try:
            self.repo.delete(category_id, user.id)
        except IntegrityError:
            # 業務的に「紐づくスケジュールがある」
            raise HTTPException(
                status_code=400,
                detail={"code": "CATEGORY_HAS_SCHEDULES"},
            )

        return None
