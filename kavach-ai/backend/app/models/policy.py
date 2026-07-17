from sqlalchemy import Column, String, Text, ForeignKey, Integer, Boolean, JSON
from sqlalchemy.dialects.postgresql import JSONB
from app.config import settings
from app.db.base import BaseModel


# Database-agnostic JSON column
def get_json_column():
    """Return appropriate JSON column based on database type"""
    if "postgresql" in settings.DATABASE_URL:
        return JSONB
    else:
        # SQLite uses JSON
        return JSON


class Policy(BaseModel):
    __tablename__ = "policies"
    
    user_id = Column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    rules = Column(get_json_column(), nullable=False)
    version = Column(Integer, default=1)
    is_active = Column(Boolean, default=True, index=True)
