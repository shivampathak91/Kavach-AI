from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from typing import Optional
from datetime import datetime
from app.db.session import get_db
from app.core.security import get_current_user_id
import uuid

router = APIRouter()


@router.get("/metrics")
async def get_metrics(
    agent_id: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    """Get monitoring metrics"""
    from app.models.event import Event, EventStatus
    from app.models.agent import Agent
    
    # Build base query
    query = select(Event)
    
    # Filter by user's agents
    agent_ids_query = select(Agent.id).where(Agent.user_id == uuid.UUID(user_id))
    query = query.where(Event.agent_id.in_(agent_ids_query))
    
    if agent_id:
        query = query.where(Event.agent_id == uuid.UUID(agent_id))
    if start_date:
        query = query.where(Event.created_at >= start_date)
    if end_date:
        query = query.where(Event.created_at <= end_date)
    
    # Get total events
    total_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(total_query)
    total_events = total_result.scalar() or 0
    
    # Get blocked events
    blocked_query = select(func.count()).select_from(
        query.where(Event.status == EventStatus.BLOCKED.value).subquery()
    )
    blocked_result = await db.execute(blocked_query)
    blocked_events = blocked_result.scalar() or 0
    
    # Get approved events
    approved_query = select(func.count()).select_from(
        query.where(Event.status == EventStatus.APPROVED.value).subquery()
    )
    approved_result = await db.execute(approved_query)
    approved_events = approved_result.scalar() or 0
    
    # Get average risk score
    risk_query = select(func.avg(Event.risk_score)).select_from(
        query.where(Event.risk_score.isnot(None)).subquery()
    )
    risk_result = await db.execute(risk_query)
    avg_risk_score = float(risk_result.scalar() or 0)
    
    # Get average trust score
    trust_query = select(func.avg(Event.trust_score_at_time)).select_from(
        query.where(Event.trust_score_at_time.isnot(None)).subquery()
    )
    trust_result = await db.execute(trust_query)
    avg_trust_score = float(trust_result.scalar() or 0)
    
    # Get top tools
    tools_query = select(
        Event.tool_name,
        func.count(Event.tool_name).label('count')
    ).where(
        Event.agent_id.in_(agent_ids_query),
        Event.tool_name.isnot(None)
    ).group_by(Event.tool_name).order_by(func.count(Event.tool_name).desc()).limit(10)
    
    tools_result = await db.execute(tools_query)
    top_tools = [{"tool_name": row.tool_name, "count": row.count} for row in tools_result]
    
    # Get risk distribution
    from sqlalchemy import case
    risk_dist_query = select(
        case(
            (Event.risk_score < 0.3, "low"),
            (Event.risk_score < 0.6, "medium"),
            (Event.risk_score < 0.8, "high"),
            else_="critical"
        ).label("risk_level"),
        func.count().label("count")
    ).where(
        Event.agent_id.in_(agent_ids_query),
        Event.risk_score.isnot(None)
    ).group_by("risk_level")
    
    risk_dist_result = await db.execute(risk_dist_query)
    risk_distribution = {row.risk_level: row.count for row in risk_dist_result}
    
    return {
        "total_events": total_events,
        "blocked_events": blocked_events,
        "approved_events": approved_events,
        "avg_risk_score": avg_risk_score,
        "avg_trust_score": avg_trust_score,
        "top_tools": top_tools,
        "risk_distribution": {
            "low": risk_distribution.get("low", 0),
            "medium": risk_distribution.get("medium", 0),
            "high": risk_distribution.get("high", 0),
            "critical": risk_distribution.get("critical", 0)
        }
    }


@router.get("/live")
async def get_live_metrics(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    """Get live monitoring data"""
    from app.models.agent import Agent
    from app.models.event import Event, EventStatus
    from app.models.approval import Approval
    
    # Get active agents count
    agent_query = select(func.count()).where(
        Agent.user_id == uuid.UUID(user_id),
        Agent.status == "active"
    )
    agent_result = await db.execute(agent_query)
    active_agents = agent_result.scalar() or 0
    
    # Get pending approvals count
    approval_query = select(func.count()).where(
        Approval.user_id == uuid.UUID(user_id)
    )
    approval_result = await db.execute(approval_query)
    pending_approvals = approval_result.scalar() or 0
    
    # Get recent high-risk events
    recent_events_query = select(Event).where(
        Event.agent_id.in_(select(Agent.id).where(Agent.user_id == uuid.UUID(user_id))),
        Event.risk_score >= 0.7
    ).order_by(Event.created_at.desc()).limit(5)
    
    recent_events_result = await db.execute(recent_events_query)
    recent_alerts = [
        {
            "type": "high_risk" if event.risk_score >= 0.8 else "medium_risk",
            "message": f"High risk action detected: {event.tool_name or event.event_type}",
            "agent_id": str(event.agent_id),
            "event_id": str(event.id),
            "timestamp": event.created_at.isoformat() if event.created_at else None
        }
        for event in recent_events_result.scalars().all()
    ]
    
    return {
        "active_agents": active_agents,
        "pending_approvals": pending_approvals,
        "recent_alerts": recent_alerts
    }
