from fastapi import APIRouter, status, Body

from app.api.deps import CurrentUser, SessionDep
from app.schemas.user import (
    UserCreate,
    UserResponse,
    UserLogin,
    TokenResponse,
)
from app.services.user_service import UserService

router = APIRouter(prefix="/auth", tags=["auth"])


# --- Signup ---
@router.post(
    "/signup",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    include_in_schema=False,
)
def signup(
    user_in: UserCreate,
    db: SessionDep,
):
    service = UserService(db)
    return service.signup(user_in)


# --- Login ---
@router.post("/login", response_model=TokenResponse)
def login(
    user_in: UserLogin,
    db: SessionDep,
):
    service = UserService(db)
    return service.login(user_in)


# --- Refresh ---
@router.post("/refresh", response_model=TokenResponse)
def refresh(
    db: SessionDep,
    refresh_token: str = Body(..., embed=True),
):
    service = UserService(db)
    return service.refresh(refresh_token)


# --- Logout ---
@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(
    db: SessionDep,
    refresh_token: str = Body(..., embed=True),
):
    service = UserService(db)
    service.logout(refresh_token)
    return None


# --- Me ---
@router.get("/me", response_model=UserResponse)
def read_me(
    current_user: CurrentUser,
):
    return current_user
