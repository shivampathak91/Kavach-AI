from pydantic import BaseModel, Field, field_validator
from typing import Optional, Dict, Any, Union
from datetime import datetime
from app.models.agent import AgentType, AgentStatus


class AgentBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    type: Union[AgentType, str]
    config: Optional[Dict[str, Any]] = None

    @field_validator('type')
    @classmethod
    def validate_type(cls, v: Union[AgentType, str]) -> AgentType:
        if isinstance(v, str):
            return AgentType(v.lower())
        return v


class AgentCreate(AgentBase):
    api_key: str = Field(..., min_length=1)


class AgentUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    config: Optional[Dict[str, Any]] = None
    status: Optional[AgentStatus] = None


class AgentResponse(AgentBase):
    id: str
    trust_score: float
    status: AgentStatus
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
