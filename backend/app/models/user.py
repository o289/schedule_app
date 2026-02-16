from sqlalchemy import Column, String
from sqlalchemy.orm import relationship


from app.core.database import BaseTable


class User(BaseTable):
    __tablename__ = "users"

    email = Column(String, unique=True, nullable=False)
    refresh_token = Column(String, nullable=True)

    passkeys = relationship("Passkey", back_populates="user", cascade="all, delete")
    categories = relationship("Category", back_populates="user", cascade="all, delete")
    schedules = relationship("Schedule", back_populates="user", cascade="all, delete")
