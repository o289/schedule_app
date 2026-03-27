from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional


class UserResponse(BaseModel):  # サインアップ出力
    email: Optional[EmailStr]

    model_config = ConfigDict(from_attributes=True)
