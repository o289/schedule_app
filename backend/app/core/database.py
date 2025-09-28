import sqlalchemy as sa
from sqlalchemy import create_engine, Column
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import sessionmaker, Session
from app.core.config import settings
from sqlalchemy.ext.declarative import declarative_base


engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class BaseTable(Base):
    __abstract__ = True 

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=sa.text("gen_random_uuid()")
    )

def get_db():
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()