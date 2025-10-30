from typing import Optional

from app.core.config import settings

from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException


# 共通のエラーjsonフォーマット
# 3回出てくる処理のため、実装
def _error_format(
    status_code: int, message: str, field: Optional[str], action_plan: Optional[str]
) -> JSONResponse:
    code = status_code
    content = {
        "error": {
            "code": code,
            "message": message,
            "details": {
                "field": field,
                "action_plan": action_plan,
            },
        }
    }
    return JSONResponse(status_code=code, content=content)


# HTTPException ハンドラ
async def http_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """
    Kotlinの `when is` 構文に似た例外分岐ハンドラー。
    例外の型によって返すレスポンスを切り替えます。

    使い方
    add.add_exception_handler(StarletteHTTPException, http_exception_handler)
    """
    match exc:
        case HTTPException():
            return _error_format(
                status_code=exc.status_code,
                message=exc.detail,
                field=None,
                action_plan="入力内容を確認してください",
            )

        case RequestValidationError():
            errors = exc.errors()
            first_error = errors[0] if errors else {}

            return _error_format(
                status_code=422,
                message="入力値が不正です",
                field=first_error.get("loc", ["unknown"])[-1],
                action_plan=first_error.get("msg"),
            )
        case _:
            message = str(exc) if settings.DEBUG else "サーバサイドの問題です"
            return _error_format(
                status_code=500,
                message=message,
                field=None,
                action_plan="再度お試しください",
            )
