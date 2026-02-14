from fastapi import HTTPException


class APIError(HTTPException):
    def __init__(self, status_code: int, code: str):
        detail = {"code": code}

        super().__init__(
            status_code=status_code,
            detail=detail,
        )


class BadRequestError(APIError):
    def __init__(self, code: str):
        super().__init__(400, code)


class UnauthorizedError(APIError):
    def __init__(self, code: str):
        super().__init__(401, code)


class ForbiddenError(APIError):
    def __init__(self, code: str):
        super().__init__(403, code)


class NotFoundError(APIError):
    def __init__(self, code: str):
        super().__init__(404, code)


class ConflictError(APIError):
    def __init__(self, code: str):
        super().__init__(409, code)


class ValidationError(APIError):
    def __init__(self, code: str):
        super().__init__(422, code)


class ServerError(APIError):
    def __init__(self, code: str):
        super().__init__(500, code)
