# backend/app/schemas/auth.py

from pydantic import BaseModel, EmailStr
from typing import Any, Dict, Optional


# =========================
# 共通レスポンスラッパー
# =========================


class DataResponse(BaseModel):
    data: Any


# =========================
# Register
# =========================

# --- Request ---


class PasskeyRegisterOptionsRequest(BaseModel):
    email: EmailStr


class PasskeyRegisterVerifyRequest(BaseModel):
    id: str
    rawId: str
    response: Dict[str, Any]
    type: str


# --- Response ---


class PasskeyRegisterOptionsResponse(BaseModel):
    data: Dict[str, Any]  # PublicKeyCredentialCreationOptions


class PasskeyRegisterVerifyResponse(BaseModel):
    data: Optional[None] = None


# =========================
# Login
# =========================

# --- Request ---


class PasskeyLoginOptionsRequest(BaseModel):
    email: EmailStr


class PasskeyLoginVerifyRequest(BaseModel):
    id: str
    rawId: str
    response: Dict[str, Any]
    type: str


# --- Response ---


class PasskeyLoginOptionsResponse(BaseModel):
    data: Dict[str, Any]  # PublicKeyCredentialRequestOptions


class TokenResponse(BaseModel):
    data: Dict[str, str]  # { access_token, refresh_token }
