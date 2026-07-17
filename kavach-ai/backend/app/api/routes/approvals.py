from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from typing import Optional, List
from app.db.session import get_db
from app.models.approval import Approval, ApprovalDecision
from app.models.event import Event
from app.schemas.approval import ApprovalCreate, ApprovalResponse, ApprovalListResponse
from app.core.security import get_current_user_id
import uuid

router = APIRouter()


@router.get("", response_model=ApprovalListResponse)
async def list_approvals(
    status_filter: Optional[str] = Query(None, alias="status"),
    agent_id: Optional[str] = None,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    """List pending and completed approvals"""
    query = select(Approval).where(Approval.user_id == uuid.UUID(user_id))
    
    if status_filter:
        query = query.where(Approval.decision == status_filter)
    
    if agent_id:
        # Filter by agent's events
        event_query = select(Event.id).where(Event.agent_id == uuid.UUID(agent_id))
        query = query.where(Approval.event_id.in_(event_query))
    
    query = query.order_by(Approval.created_at.desc())
    
    result = await db.execute(query)
    approvals = result.scalars().all()
    
    return ApprovalListResponse(
        approvals=approvals,
        total=len(approvals)
    )


@router.post("/{approval_id}/decision", response_model=ApprovalResponse)
async def submit_approval_decision(
    approval_id: str,
    decision_data: ApprovalCreate,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    """Submit an approval decision"""
    result = await db.execute(
        select(Approval)
        .where(
            Approval.id == uuid.UUID(approval_id),
            Approval.user_id == uuid.UUID(user_id)
        )
    )
    approval = result.scalar_one_or_none()
    
    if not approval:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Approval not found"
        )
    
    # Update approval
    approval.decision = decision_data.decision.value
    approval.reason = decision_data.reason
    approval.reviewed_at = str(uuid.uuid4())  # Using UUID as timestamp placeholder
    
    # Update corresponding event status
    from app.models.event import EventStatus
    event_result = await db.execute(
        select(Event).where(Event.id == approval.event_id)
    )
    event = event_result.scalar_one_or_none()
    
    if event:
        if decision_data.decision == ApprovalDecision.APPROVED:
            event.status = EventStatus.APPROVED.value
        else:
            event.status = EventStatus.REJECTED.value
    
    await db.commit()
    await db.refresh(approval)
    
    return approval
