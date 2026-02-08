from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException


def _error_format(status_code: int, code: str) -> JSONResponse:
    return JSONResponse(
        status_code=status_code,
        content={"code": code},
    )


async def http_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """
    Kotlinの `when is` 構文に似た例外分岐ハンドラー。
    例外の型によって返すレスポンスを切り替えます。

    使い方
    add.add_exception_handler(StarletteHTTPException, http_exception_handler)
    """
    match exc:
        case HTTPException():
            detail = exc.detail
            code = (
                detail.get("code")
                if isinstance(detail, dict) and "code" in detail
                else "HTTP_ERROR"
            )
            return _error_format(
                status_code=exc.status_code,
                code=code,
            )

        case RequestValidationError():
            return _error_format(
                status_code=422,
                code="VALIDATION_ERROR",
            )
        case _:
            return _error_format(
                status_code=500,
                code="SERVER_ERROR",
            )
