from sqlalchemy.orm import Session
from typing import Type
from app.core.database import Base
from uuid import UUID


class BaseRepository:
    def __init__(self, db: Session, model: Type[Base]):
        self.db = db
        self.model = model

    def base_add(self, obj):
        # ヒント: self.db.add() → commit → refresh
        ...
        try:
            self.db.add(obj)
            self.db.commit()
            self.db.refresh(obj)
            return obj
        except Exception as e:
            print(f"{e}というエラーが起きています")
            self.db.rollback()
            return None

    def base_get(self, id: UUID):
        return self.db.query(self.model).filter(self.model.id == id).first()

    def base_list(self, **filters):
        query = self.db.query(self.model)
        if filters:
            query = query.filter_by(**filters)
        return query.all()

    def base_delete(self, obj):
        # ヒント: self.db.delete(obj) → commit
        if obj is None:
            print("削除対象が見つからない")
            return False
        ...
        try:
            self.db.delete(obj)
            self.db.commit()
            print("コミット成功")
            return True
        except Exception as e:
            print("コミット失敗:", e)
            self.db.rollback()
            return False

    def base_update(self, obj):
        # ヒント: 属性変更後 self.db.commit()
        ...
        if obj is None:
            return None
        try:
            self.db.commit()
            self.db.refresh(obj)
            return obj
        except Exception:
            return None

    def base_create_instance(self, model, schema_in, extra: dict | None = None):
        """
        任意のモデルに対応できる共通「新規作成」関数

        【目的】
        - Pydanticモデル(schema_in) から SQLAlchemyモデル(model_class) を安全に作成する。
        - 各モデルのカラムが変わっても、この関数を修正する必要がない。

        【実現方法】
        - model_dump() で Pydanticモデルを dict に変換。
        - model_validate() で SQLAlchemyモデルを検証付きで生成。
        ※ Pydantic v2では model(**data) を使うことで、型変換や検証が自動で行われる。
        - 最後にDBに追加してコミット。
        """
        data = schema_in.model_dump()

        # extra を安全にマージ
        if extra:
            for key, value in extra.items():
                if hasattr(model, key):
                    data[key] = value

        obj = model(**data)

        return obj

    def base_apply_schema(self, obj, schema_in, exclude: set[str] | None = None):
        """
        Pydanticモデル(schema_in)のデータをSQLAlchemyモデル(obj)へ安全に適用する。
        exclude_unset=True で部分更新を行い、ifhasattr(obj,key)で存在しない属性は無視。
        """
        data = schema_in.model_dump(exclude_unset=True, exclude=exclude or set())

        for key, value in data.items():
            # None はリレーション破壊を防ぐためスキップ
            if value is None:
                continue

            if hasattr(obj, key):
                setattr(obj, key, value)

        return obj
