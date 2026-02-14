# user.py
from sqlalchemy.orm import Session
from .base import BaseRepository
from app.models.user import User


class UserRepository(BaseRepository):
    def __init__(self, db: Session):
        super().__init__(db, User)

    def create_user(self, email):
        user = User(email=email)
        return self.base_add(user)

    def get_by_email(self, email: str):
        # ヒント: query(User).filter(User.email == email).first()
        ...
        return self.db.query(User).filter(User.email == email).first()

    def update_refresh_token(self, user: User, token: str):
        user.refresh_token = token
        self.db.commit()
        self.db.refresh(user)
        return user

    def get_by_refresh_token(self, token: str):
        return self.db.query(User).filter(User.refresh_token == token).first()
