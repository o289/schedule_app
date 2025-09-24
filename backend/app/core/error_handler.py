from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.exception_handlers import RequestValidationError
from starlette.exceptions import HTTPException 
from fastapi import status

# HTTPException ハンドラ
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": exc.status_code,
                "message": exc.detail,
                "details": {
                    "field": None,
                    "action_plan": "入力内容を確認してください",
                }
            }
        },
    )

# バリデーションエラー (Pydantic) 用ハンドラ
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    first_error = errors[0] if errors else {}

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": {
                "code": 422,
                "message": "入力値が不正です",
                "details": {
                    "field": first_error.get("loc", ["unknown"])[-1],
                    "action_plan": first_error.get("msg"),
                }
            }
        },
    )