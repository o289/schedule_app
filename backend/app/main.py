from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError

from app.core.config import settings
from app.api.user import router as user_router
from app.api.category import router as category_router
from app.api.schedule import router as schedule_router
from app.api.todo import router as todo_router

from app.core.error_handler import http_exception_handler
from starlette.exceptions import HTTPException as StarletteHTTPException


app = FastAPI(debug=settings.DEBUG)


# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],  # フロントのURL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/ping")
def pong():
    return {"message": "pong"}


app.include_router(user_router)
app.include_router(category_router)
app.include_router(schedule_router)
app.include_router(todo_router)

# 共通ハンドラを登録
app.add_exception_handler(StarletteHTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, http_exception_handler)
