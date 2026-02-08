from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.crud.user import UserRepository
from app.schemas.user import UserCreate, UserLogin, TokenResponse
from app.models.user import User
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
)


class UserService:
    def __init__(self, db: Session):
        self.repo = UserRepository(db)
        self.db = db

    # --- Signup ---
    def signup(self, user_in: UserCreate) -> User:
        email = self._normalize_email(user_in.email)

        existing_user = self.repo.get_by_email(email)
        if existing_user:
            raise HTTPException(
                status_code=409,
                detail={"code": "EMAIL_ALREADY_EXISTS"},
            )

        user_in.email = email
        user_in.password = hash_password(user_in.password)

        return self.repo.create_user(user_in)

    # --- Login ---
    def login(self, user_in: UserLogin):
        user = self.repo.get_by_email(user_in.email)

        if not user or not verify_password(user_in.password, user.password):
            raise HTTPException(
                status_code=401,
                detail={"code": "INVALID_CREDENTIALS"},
            )

        access_token = create_access_token(data={"sub": str(user.id)})
        refresh_token = create_refresh_token(data={"sub": str(user.id)})

        self.repo.update_refresh_token(user, refresh_token)

        return TokenResponse(
            access_token=access_token, refresh_token=refresh_token, token_type="bearer"
        )

    # --- Refresh ---
    def refresh(self, refresh_token: str):
        user = self.repo.get_by_refresh_token(refresh_token)

        if not user:
            raise HTTPException(
                status_code=401,
                detail={"code": "INVALID_REFRESH_TOKEN"},
            )

        new_access_token = create_access_token(data={"sub": str(user.id)})

        return TokenResponse(
            access_token=new_access_token,
            refresh_token=refresh_token,
            token_type="bearer",
        )

    # --- Logout ---
    def logout(self, refresh_token: str):
        user = self.repo.get_by_refresh_token(refresh_token)

        if not user:
            raise HTTPException(
                status_code=401,
                detail={"code": "ALREADY_LOGGED_OUT"},
            )

        user.refresh_token = None
        self.db.commit()

        return None

    # --- utils ---
    def _normalize_email(self, email: str) -> str:
        return email.strip().lower()
