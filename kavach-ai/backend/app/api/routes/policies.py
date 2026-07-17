from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.db.session import get_db
from app.models.policy import Policy
from app.schemas.policy import PolicyCreate, PolicyUpdate, PolicyResponse
from app.core.security import get_current_user_id
import uuid

router = APIRouter()


@router.get("", response_model=List[PolicyResponse])
async def list_policies(
    skip: int = 0,
    limit: int = 20,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    """List all policies for the current user"""
    result = await db.execute(
        select(Policy)
        .where(Policy.user_id == uuid.UUID(user_id))
        .offset(skip)
        .limit(limit)
    )
    policies = result.scalars().all()
    return policies


@router.post("", response_model=PolicyResponse, status_code=status.HTTP_201_CREATED)
async def create_policy(
    policy_data: PolicyCreate,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    """Create a new policy"""
    policy = Policy(
        user_id=uuid.UUID(user_id),
        name=policy_data.name,
        description=policy_data.description,
        rules=[rule.dict() for rule in policy_data.rules],
        version=1,
        is_active=True
    )
    
    db.add(policy)
    await db.commit()
    await db.refresh(policy)
    
    return policy


@router.get("/{policy_id}", response_model=PolicyResponse)
async def get_policy(
    policy_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific policy"""
    result = await db.execute(
        select(Policy)
        .where(
            Policy.id == uuid.UUID(policy_id),
            Policy.user_id == uuid.UUID(user_id)
        )
    )
    policy = result.scalar_one_or_none()
    
    if not policy:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Policy not found"
        )
    
    return policy


@router.put("/{policy_id}", response_model=PolicyResponse)
async def update_policy(
    policy_id: str,
    policy_data: PolicyUpdate,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    """Update a policy"""
    result = await db.execute(
        select(Policy)
        .where(
            Policy.id == uuid.UUID(policy_id),
            Policy.user_id == uuid.UUID(user_id)
        )
    )
    policy = result.scalar_one_or_none()
    
    if not policy:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Policy not found"
        )
    
    # Update fields
    if policy_data.name is not None:
        policy.name = policy_data.name
    if policy_data.description is not None:
        policy.description = policy_data.description
    if policy_data.rules is not None:
        policy.rules = [rule.dict() for rule in policy_data.rules]
        policy.version += 1
    if policy_data.is_active is not None:
        policy.is_active = policy_data.is_active
    
    await db.commit()
    await db.refresh(policy)
    
    return policy


@router.delete("/{policy_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_policy(
    policy_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    """Delete a policy"""
    result = await db.execute(
        select(Policy)
        .where(
            Policy.id == uuid.UUID(policy_id),
            Policy.user_id == uuid.UUID(user_id)
        )
    )
    policy = result.scalar_one_or_none()
    
    if not policy:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Policy not found"
        )
    
    await db.delete(policy)
    await db.commit()
