# user.py
from sqlalchemy.orm import Session
from .base import BaseRepository
from app.models.user import User
from app.core.security import hash_password, verify_password


class UserRepository(BaseRepository):
    def __init__(self, db: Session):
        super().__init__(db, User)

    def create_user(self, user_in):
        # ヒント: パスワードをhash_passwordで変換
        # user = User(email=..., password=..., name=...)
        # return self.add(user)
        ...

        user = User(name=user_in.name, email=user_in.email, password=user_in.password)
        return self.base_add(user)

    def get_by_email(self, email: str):
        # ヒント: query(User).filter(User.email == email).first()
        ...
        return self.db.query(User).filter(User.email == email).first()

    def verify_user(self, email: str, password: str):
        # ヒント: get_by_email → NoneならNone
        # user.password と verify_password(password, user.password)
        # OKならuser、NGならNone
        ...
        user = self.get_by_email(email)
        if not user:
            return None
        if verify_password(password, user.password):
            return user
        return None

    def update_refresh_token(self, user: User, token: str):
        user.refresh_token = token
        self.db.commit()
        self.db.refresh(user)
        return user

    def get_by_refresh_token(self, token: str):
        return self.db.query(User).filter(User.refresh_token == token).first()
