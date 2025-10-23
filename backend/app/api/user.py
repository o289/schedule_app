# FastAPI 基本
from fastapi import APIRouter, HTTPException, status, Body

# DB
from sqlalchemy.orm import Session
from app.api.deps import CurrentUser, SessionDep

# Repository
from app.crud.user import UserRepository

# スキーマ
from app.schemas.user import UserCreate, UserResponse, UserLogin, TokenResponse

# セキュリティ（JWT）
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
)

# モデル達（User認証用に参照）
from app.models.user import User


router = APIRouter(prefix="/auth", tags=["auth"])


def _normalize_email(email: str) -> str:
    return email.strip().lower()


# --- Signup ---
@router.post(
    "/signup",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="ユーザー登録",
    include_in_schema=False,
)
def signup(user_in: UserCreate, db: Session = SessionDep):
    repo = UserRepository(db)

    email = _normalize_email(user_in.email)

    existing_user = repo.get_by_email(email)

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="このメールはすでに登録済みです",
        )

    user_in.email = email
    user = repo.create_user(user_in)

    return user


# --- Login ---
@router.post("/login", response_model=TokenResponse)
def login(user_in: UserLogin, db: Session = SessionDep):
    repo = UserRepository(db)
    user = repo.verify_user(user_in.email, user_in.password)

    if not user:
        raise HTTPException(status_code=401, detail="メールまたはパスワードが不正です")

    # アクセストークン & リフレッシュトークン発行
    access_token = create_access_token(data={"sub": str(user.id)})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})

    # DBにリフレッシュトークンを保存（上書き）
    repo.update_refresh_token(user, refresh_token)

    return TokenResponse(
        access_token=access_token, refresh_token=refresh_token, token_type="bearer"
    )


# --- refresh ---
@router.post("/refresh", response_model=TokenResponse)
def refresh(refresh_token: str = Body(..., embed=True), db: Session = SessionDep):
    repo = UserRepository(db)
    user = repo.get_by_refresh_token(refresh_token)

    if not user:
        raise HTTPException(status_code=401, detail="リフレッシュトークンが無効です")

    # 新しいアクセストークン発行
    new_access_token = create_access_token(data={"sub": str(user.id)})

    return TokenResponse(
        access_token=new_access_token, refresh_token=refresh_token, token_type="bearer"
    )


# --- Logout ---
@router.post("/logout")
def logout(refresh_token: str = Body(..., embed=True), db: Session = SessionDep):
    repo = UserRepository(db)
    user = repo.get_by_refresh_token(refresh_token)

    if not user:
        raise HTTPException(status_code=401, detail="既にログアウト済みです")

    # トークン削除
    user.refresh_token = None
    db.commit()

    return {"msg": "ログアウトしました"}


# --- Me ---
# 現在のユーザー
@router.get("/me", response_model=UserResponse)
def read_me(current_user: User = CurrentUser):
    return current_user
