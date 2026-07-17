from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from typing import Optional, List
from datetime import datetime
from app.db.session import get_db
from app.models.event import Event
from app.schemas.event import EventResponse, EventListResponse
from app.core.security import get_current_user_id
import uuid

router = APIRouter()


@router.get("", response_model=EventListResponse)
async def list_events(
    agent_id: Optional[str] = None,
    event_type: Optional[str] = None,
    status_filter: Optional[str] = Query(None, alias="status"),
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    """List events with filtering"""
    # Build query
    query = select(Event)
    
    # Filter by user's agents
    from app.models.agent import Agent
    agent_ids_query = select(Agent.id).where(Agent.user_id == uuid.UUID(user_id))
    query = query.where(Event.agent_id.in_(agent_ids_query))
    
    # Apply filters
    if agent_id:
        query = query.where(Event.agent_id == uuid.UUID(agent_id))
    if event_type:
        query = query.where(Event.event_type == event_type)
    if status_filter:
        query = query.where(Event.status == status_filter)
    if start_date:
        query = query.where(Event.created_at >= start_date)
    if end_date:
        query = query.where(Event.created_at <= end_date)
    
    # Get total count
    from sqlalchemy import func
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar()
    
    # Apply pagination
    query = query.order_by(Event.created_at.desc())
    query = query.offset((page - 1) * page_size).limit(page_size)
    
    result = await db.execute(query)
    events = result.scalars().all()
    
    return EventListResponse(
        events=events,
        total=total,
        page=page,
        page_size=page_size
    )


@router.get("/{event_id}", response_model=EventResponse)
async def get_event(
    event_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific event"""
    # Ensure user has access to this event's agent
    from app.models.agent import Agent
    agent_ids_query = select(Agent.id).where(Agent.user_id == uuid.UUID(user_id))
    
    result = await db.execute(
        select(Event)
        .where(
            Event.id == uuid.UUID(event_id),
            Event.agent_id.in_(agent_ids_query)
        )
    )
    event = result.scalar_one_or_none()
    
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    
    return event
