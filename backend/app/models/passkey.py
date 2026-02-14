from sqlalchemy import Column, String, ForeignKey, Text, Integer, DateTime
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import BaseTable
from sqlalchemy.orm import relationship


class Passkey(BaseTable):
    __tablename__ = "passkeys"

    user_id = Column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )

    credential_id = Column(String, unique=True, nullable=False)
    public_key = Column(Text, nullable=False)

    sign_count = Column(Integer, nullable=False, default=0)
    transports = Column(String, nullable=True)

    created_at = Column(
        DateTime,
        nullable=False,
        server_default=func.now(),
    )
    last_used_at = Column(DateTime, nullable=True)
    user = relationship("User", back_populates="passkeys")
