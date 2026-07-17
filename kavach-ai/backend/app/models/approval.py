from sqlalchemy import Column, String, Text, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.db.base import BaseModel
import enum


class ApprovalDecision(str, enum.Enum):
    APPROVED = "approved"
    REJECTED = "rejected"


class Approval(BaseModel):
    __tablename__ = "approvals"
    
    event_id = Column(ForeignKey("events.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    decision = Column(String(50), nullable=False)
    reason = Column(Text)
    reviewed_at = Column(DateTime(timezone=True), server_default=func.now())
