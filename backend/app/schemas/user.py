from pydantic import BaseModel, EmailStr
from uuid import UUID
from typing import Optional

class UserCreate(BaseModel):   # サインアップ入力
    name: Optional[str] = None
    email: Optional[EmailStr]
    password: str

class UserResponse(BaseModel): # サインアップ出力
    id: UUID
    name: Optional[str]
    email: Optional[EmailStr]

    class Config:
        from_attributes = True

class UserLogin(BaseModel):    # ログイン入力
    email: Optional[EmailStr]
    password: str

class TokenResponse(BaseModel): # ログイン出力
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
