from sqlalchemy import Column, String, Text, ForeignKey, Numeric, Boolean, Integer, JSON
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.config import settings
from app.db.base import BaseModel
import enum


# Database-agnostic JSON column
def get_json_column():
    """Return appropriate JSON column based on database type"""
    if "postgresql" in settings.DATABASE_URL:
        return JSONB
    else:
        # SQLite uses JSON
        return JSON


class EventType(str, enum.Enum):
    TOOL_CALL = "tool_call"
    PROMPT = "prompt"
    RESPONSE = "response"
    ERROR = "error"


class EventStatus(str, enum.Enum):
    PENDING = "pending"
    ALLOWED = "allowed"
    BLOCKED = "blocked"
    APPROVED = "approved"
    REJECTED = "rejected"


class PolicyDecision(str, enum.Enum):
    ALLOW = "allow"
    BLOCK = "block"
    REQUIRE_APPROVAL = "require_approval"


class Event(BaseModel):
    __tablename__ = "events"
    
    agent_id = Column(ForeignKey("agents.id", ondelete="CASCADE"), nullable=False, index=True)
    event_type = Column(String(100), nullable=False, index=True)
    tool_name = Column(String(255), index=True)
    tool_args = Column(get_json_column())
    prompt_text = Column(Text)
    response_text = Column(Text)
    intent_analysis = Column(get_json_column())
    risk_score = Column(Numeric(5, 4), index=True)
    trust_score_at_time = Column(Numeric(5, 4))
    policy_decision = Column(String(50))
    policy_id = Column(ForeignKey("policies.id"))
    prompt_injection_detected = Column(Boolean, default=False)
    injection_score = Column(Numeric(5, 4))
    anomaly_detected = Column(Boolean, default=False)
    anomaly_score = Column(Numeric(5, 4))
    human_approval_required = Column(Boolean, default=False)
    human_approval_id = Column(String(36))
    execution_time_ms = Column(Integer)
    status = Column(String(50), default=EventStatus.PENDING.value, index=True)
    error_message = Column(Text)
    meta_data = Column(get_json_column())
