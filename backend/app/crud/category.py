from sqlalchemy.orm import Session
from .base import BaseRepository
from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryUpdate
from uuid import UUID


class CategoryRepository(BaseRepository):
    def __init__(self, db: Session):
        super().__init__(db, Category)

    # --- 作成 ---
    def create(self, user_id: UUID, category_in: CategoryCreate) -> Category:
        category = Category(
            user_id=user_id,
            name=category_in.name,
            color=category_in.color.value,  # Enum → str
        )
        return self.base_add(category)

    # --- 取得（ID指定） ---
    def get(self, category_id: UUID) -> Category | None:
        return self.base_get(category_id)

    # --- ユーザーの全カテゴリ取得 ---
    def get_by_user(self, user_id: UUID) -> list[Category]:
        return self.base_list(user_id=user_id)

    # --- 削除 ---
    def delete(self, category_id: UUID, user_id: UUID) -> bool:
        obj = (
            self.db.query(Category)
            .filter(Category.id == category_id, Category.user_id == user_id)
            .first()
        )
        if not obj:
            return False
        return self.base_delete(obj)  # ← オブジェクトを渡す

    # --- 更新 ---
    def update(self, category_id: UUID, category_in: CategoryUpdate) -> Category | None:
        category = self.get(category_id)
        if not category:
            return None

        if category_in.name is not None:
            category.name = category_in.name
        if category_in.color is not None:
            category.color = category_in.color.value

        return self.base_update(category)  # ここで commit + refresh 済み
