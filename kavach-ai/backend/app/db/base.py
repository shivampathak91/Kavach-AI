from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, String, DateTime, Numeric, Boolean, Text, Integer, ForeignKey, JSON, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from app.config import settings
import uuid
import enum


Base = declarative_base()


# Database-agnostic ID column
def get_id_column():
    """Return appropriate ID column based on database type"""
    if "postgresql" in settings.DATABASE_URL:
        return Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    else:
        # SQLite uses String for UUID
        return Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))


class BaseModel(Base):
    """Base model with common fields"""
    __abstract__ = True
    
    id = get_id_column()
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
