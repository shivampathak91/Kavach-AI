from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.approval import ApprovalDecision


class ApprovalBase(BaseModel):
    decision: ApprovalDecision
    reason: Optional[str] = None


class ApprovalCreate(ApprovalBase):
    pass


class ApprovalResponse(ApprovalBase):
    id: str
    event_id: str
    user_id: str
    reviewed_at: datetime
    
    class Config:
        from_attributes = True


class ApprovalListResponse(BaseModel):
    approvals: list[ApprovalResponse]
    total: int
