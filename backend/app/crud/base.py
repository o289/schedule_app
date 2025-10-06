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
        except Exception:
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
            print("コミット成功:", e)
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
