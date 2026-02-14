from sqlalchemy import Column, String, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import BaseTable


class Challenge(BaseTable):
    __tablename__ = "challenges"

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
    )

    challenge = Column(String, nullable=False)

    type = Column(String, nullable=False)
    # "register" or "login"

    expires_at = Column(DateTime, nullable=False)
