from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime


class PolicyRule(BaseModel):
    condition: str
    action: str
    parameters: Optional[Dict[str, Any]] = None


class PolicyBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    rules: List[PolicyRule]


class PolicyCreate(PolicyBase):
    pass


class PolicyUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    rules: Optional[List[PolicyRule]] = None
    is_active: Optional[bool] = None


class PolicyResponse(PolicyBase):
    id: str
    version: int
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
