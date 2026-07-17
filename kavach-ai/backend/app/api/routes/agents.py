from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.db.session import get_db
from app.models.user import User
from app.models.agent import Agent
from app.schemas.agent import AgentCreate, AgentUpdate, AgentResponse
from app.core.security import get_current_user_id
import uuid

router = APIRouter()


@router.get("", response_model=List[AgentResponse])
async def list_agents(
    skip: int = 0,
    limit: int = 20,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    """List all agents for the current user"""
    result = await db.execute(
        select(Agent)
        .where(Agent.user_id == uuid.UUID(user_id))
        .offset(skip)
        .limit(limit)
    )
    agents = result.scalars().all()
    return agents


@router.post("", response_model=AgentResponse, status_code=status.HTTP_201_CREATED)
async def create_agent(
    agent_data: AgentCreate,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    """Create a new agent"""
    # In production, encrypt the API key before storing
    # Convert UUID to string for SQLite compatibility
    from app.config import settings
    user_id_value = user_id if "postgresql" in settings.DATABASE_URL else str(uuid.UUID(user_id))
    
    agent = Agent(
        user_id=user_id_value,
        name=agent_data.name,
        type=agent_data.type.value,
        api_key_encrypted=agent_data.api_key,  # TODO: Encrypt this
        config=agent_data.config,
        trust_score=0.5
    )
    
    db.add(agent)
    await db.commit()
    await db.refresh(agent)
    
    return agent


@router.get("/{agent_id}", response_model=AgentResponse)
async def get_agent(
    agent_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific agent"""
    result = await db.execute(
        select(Agent)
        .where(
            Agent.id == uuid.UUID(agent_id),
            Agent.user_id == uuid.UUID(user_id)
        )
    )
    agent = result.scalar_one_or_none()
    
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agent not found"
        )
    
    return agent


@router.put("/{agent_id}", response_model=AgentResponse)
async def update_agent(
    agent_id: str,
    agent_data: AgentUpdate,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    """Update an agent"""
    result = await db.execute(
        select(Agent)
        .where(
            Agent.id == uuid.UUID(agent_id),
            Agent.user_id == uuid.UUID(user_id)
        )
    )
    agent = result.scalar_one_or_none()
    
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agent not found"
        )
    
    # Update fields
    if agent_data.name is not None:
        agent.name = agent_data.name
    if agent_data.config is not None:
        agent.config = agent_data.config
    if agent_data.status is not None:
        agent.status = agent_data.status.value
    
    await db.commit()
    await db.refresh(agent)
    
    return agent


@router.delete("/{agent_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_agent(
    agent_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    """Delete an agent"""
    result = await db.execute(
        select(Agent)
        .where(
            Agent.id == uuid.UUID(agent_id),
            Agent.user_id == uuid.UUID(user_id)
        )
    )
    agent = result.scalar_one_or_none()
    
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agent not found"
        )
    
    await db.delete(agent)
    await db.commit()
