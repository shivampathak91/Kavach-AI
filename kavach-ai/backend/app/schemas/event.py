from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime
from decimal import Decimal
from app.models.event import EventType, EventStatus, PolicyDecision


class EventBase(BaseModel):
    agent_id: str
    event_type: EventType
    tool_name: Optional[str] = None
    tool_args: Optional[Dict[str, Any]] = None
    prompt_text: Optional[str] = None
    response_text: Optional[str] = None


class EventCreate(EventBase):
    conversation_history: Optional[List[Dict[str, Any]]] = None


class EventResponse(EventBase):
    id: str
    intent_analysis: Optional[Dict[str, Any]] = None
    risk_score: Optional[Decimal] = None
    trust_score_at_time: Optional[Decimal] = None
    policy_decision: Optional[PolicyDecision] = None
    policy_id: Optional[str] = None
    prompt_injection_detected: bool
    injection_score: Optional[Decimal] = None
    anomaly_detected: bool
    anomaly_score: Optional[Decimal] = None
    human_approval_required: bool
    human_approval_id: Optional[str] = None
    execution_time_ms: Optional[int] = None
    status: EventStatus
    error_message: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class EventListResponse(BaseModel):
    events: List[EventResponse]
    total: int
    page: int
    page_size: int
