from pydantic import BaseModel, EmailStr
from typing import Optional


class UserResponse(BaseModel):  # サインアップ出力
    email: Optional[EmailStr]

    class Config:
        from_attributes = True
