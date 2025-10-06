from pydantic import BaseModel
from uuid import UUID
from enum import Enum
from typing import Optional


# --- ENUM定義 ---
class CategoryColor(str, Enum):
    gray = "gray"
    red = "red"
    blue = "blue"
    green = "green"
    yellow = "yellow"
    purple = "purple"
    orange = "orange"
    pink = "pink"


# --- 共通スキーマ ---
class CategoryBase(BaseModel):
    name: str
    color: CategoryColor = CategoryColor.gray  # デフォルト gray


# --- 作成時 ---
class CategoryCreate(CategoryBase):
    pass  # 基本は同じ


# --- 更新時 ---
class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    color: Optional[CategoryColor] = None


# --- レスポンス用 ---
class CategoryResponse(CategoryBase):
    id: UUID
    user_id: UUID

    class Config:
        from_attributes = True  # SQLAlchemyからの変換用
