from fastapi import APIRouter, status, Body

from app.api.deps import CurrentUser, SessionDep

from app.schemas.user import UserResponse
from app.schemas.auth import TokenResponse
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])


# --- Refresh ---
@router.post("/refresh", response_model=TokenResponse)
def refresh(
    db: SessionDep,
    refresh_token: str = Body(..., embed=True),
):
    service = AuthService(db)
    return service.refresh(refresh_token)


# --- Logout ---
@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(
    db: SessionDep,
    refresh_token: str = Body(..., embed=True),
):
    service = AuthService(db)
    service.logout(refresh_token)
    return None


# --- Me ---
@router.get("/me", response_model=UserResponse)
def read_me(
    current_user: CurrentUser,
):
    return current_user
