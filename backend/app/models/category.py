from sqlalchemy import Column, String, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import enum

from app.core.database import BaseTable


# 色を固定 ENUM として定義
class CategoryColor(str, enum.Enum):
    red = "red"
    blue = "blue"
    green = "green"
    yellow = "yellow"
    purple = "purple"
    orange = "orange"
    pink = "pink"
    teal = "teal"
    gray = "gray"
    brown = "brown"


class Category(BaseTable):
    __tablename__ = "categories"

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(50), nullable=False)
    color = Column(Enum(CategoryColor, name="category_color"), nullable=False, default=CategoryColor.gray)

    # 制約: ユーザーごとにカテゴリ名がユニーク
    __table_args__ = (
        # UNIQUE 制約
        {"sqlite_autoincrement": True},
    )

    user = relationship("User", back_populates="categories")

    schedules = relationship("Schedule", back_populates="category")