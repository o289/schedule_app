from typing import Annotated

# app/api/deps.py
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.core.api_error import UnauthorizedError

from app.core.config import settings
from app.core.database import get_db
from app.models.user import User

# Authorizationヘッダから "Bearer <token>" を取り出す仕組み
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/passkey/login/verify")

SessionDep = Annotated[Session, Depends(get_db)]
TokenDep = Annotated[str, Depends(oauth2_scheme)]


def get_current_user(token: TokenDep, db: SessionDep) -> User:
    """
    JWTを検証し、DBからユーザーを取得する依存関数。
    無効なら 401 を返す。
    """

    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            raise UnauthorizedError("INVALID_TOKEN")

    except JWTError:
        raise UnauthorizedError("TOKEN_VERIFICATION_FAILED")

    user = db.query(User).filter(User.id == user_id).first()

    if user is None:
        raise UnauthorizedError("USER_NOT_FOUND")

    return user


CurrentUser = Annotated[User, Depends(get_current_user)]
