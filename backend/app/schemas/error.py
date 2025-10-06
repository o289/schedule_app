from pydantic import BaseModel
from typing import Optional, Dict


class ErrorDetail(BaseModel):
    field: Optional[str] = None
    action_plan: Optional[str] = None


class ErrorResponse(BaseModel):
    error: Dict[str, object]  # {"code": int, "message": str, "details": {...}}
