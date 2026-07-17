from sqlalchemy import Column, String, Numeric, Text, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import JSONB
from app.config import settings
from app.db.base import BaseModel, get_id_column
import enum


# Database-agnostic JSON column
def get_json_column():
    """Return appropriate JSON column based on database type"""
    if "postgresql" in settings.DATABASE_URL:
        return JSONB
    else:
        # SQLite uses JSON
        return JSON


class AgentType(str, enum.Enum):
    CLAUDE = "claude"
    GPT = "gpt"
    GEMINI = "gemini"
    CUSTOM = "custom"


class AgentStatus(str, enum.Enum):
    ACTIVE = "active"
    SUSPENDED = "suspended"
    DELETED = "deleted"


class Agent(BaseModel):
    __tablename__ = "agents"
    
    # Use database-agnostic ID column
    id = get_id_column()
    
    user_id = Column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    type = Column(String(100), nullable=False, index=True)
    api_key_encrypted = Column(Text)
    config = Column(get_json_column())
    trust_score = Column(Numeric(5, 4), default=0.5000, index=True)
    status = Column(String(50), default=AgentStatus.ACTIVE.value)
