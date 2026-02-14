# backend/app/api/auth.py
from fastapi import APIRouter

from app.api.deps import SessionDep
from app.schemas.auth import (
    PasskeyRegisterOptionsRequest,
    PasskeyRegisterOptionsResponse,
    PasskeyRegisterVerifyRequest,
    PasskeyRegisterVerifyResponse,
    PasskeyLoginOptionsRequest,
    PasskeyLoginOptionsResponse,
    PasskeyLoginVerifyRequest,
    TokenResponse,
)
from app.services.auth_service import AuthService


router = APIRouter(prefix="/auth/passkey", tags=["passkey"])


# =========================
# Register
# =========================


@router.post(
    "/register/options",
    response_model=PasskeyRegisterOptionsResponse,
)
def register_options(
    payload: PasskeyRegisterOptionsRequest,
    db: SessionDep,
):
    service = AuthService(db)
    return service.register_options(payload)


@router.post(
    "/register/verify",
    response_model=PasskeyRegisterVerifyResponse,
)
def register_verify(
    payload: PasskeyRegisterVerifyRequest,
    db: SessionDep,
):
    service = AuthService(db)
    return service.register_verify(payload)


# =========================
# Login
# =========================


@router.post(
    "/login/options",
    response_model=PasskeyLoginOptionsResponse,
)
def login_options(
    payload: PasskeyLoginOptionsRequest,
    db: SessionDep,
):
    service = AuthService(db)
    return service.login_options(payload)


@router.post(
    "/login/verify",
    response_model=TokenResponse,
)
def login_verify(
    payload: PasskeyLoginVerifyRequest,
    db: SessionDep,
):
    service = AuthService(db)
    return service.login_verify(payload)
