from enum import Enum
from typing import List, Set
from fastapi import HTTPException, status
from app.models.user import UserRole


class Permission(str, Enum):
    # User permissions
    CREATE_AGENT = "create_agent"
    READ_AGENT = "read_agent"
    UPDATE_AGENT = "update_agent"
    DELETE_AGENT = "delete_agent"
    
    # Policy permissions
    CREATE_POLICY = "create_policy"
    READ_POLICY = "read_policy"
    UPDATE_POLICY = "update_policy"
    DELETE_POLICY = "delete_policy"
    
    # Event permissions
    READ_EVENTS = "read_events"
    DELETE_EVENTS = "delete_events"
    
    # Approval permissions
    APPROVE_ACTION = "approve_action"
    REJECT_ACTION = "reject_action"
    
    # Attack simulation permissions
    RUN_ATTACK_SIMULATION = "run_attack_simulation"
    READ_ATTACK_RESULTS = "read_attack_results"
    
    # Monitoring permissions
    VIEW_METRICS = "view_metrics"
    VIEW_ANALYTICS = "view_analytics"
    
    # Admin permissions
    MANAGE_USERS = "manage_users"
    MANAGE_ROLES = "manage_roles"
    VIEW_AUDIT_LOGS = "view_audit_logs"


# Role-based permission mapping
ROLE_PERMISSIONS: dict[UserRole, Set[Permission]] = {
    UserRole.ADMIN: {
        # All permissions
        Permission.CREATE_AGENT,
        Permission.READ_AGENT,
        Permission.UPDATE_AGENT,
        Permission.DELETE_AGENT,
        Permission.CREATE_POLICY,
        Permission.READ_POLICY,
        Permission.UPDATE_POLICY,
        Permission.DELETE_POLICY,
        Permission.READ_EVENTS,
        Permission.DELETE_EVENTS,
        Permission.APPROVE_ACTION,
        Permission.REJECT_ACTION,
        Permission.RUN_ATTACK_SIMULATION,
        Permission.READ_ATTACK_RESULTS,
        Permission.VIEW_METRICS,
        Permission.VIEW_ANALYTICS,
        Permission.MANAGE_USERS,
        Permission.MANAGE_ROLES,
        Permission.VIEW_AUDIT_LOGS,
    },
    UserRole.SECURITY_ANALYST: {
        Permission.READ_AGENT,
        Permission.CREATE_POLICY,
        Permission.READ_POLICY,
        Permission.UPDATE_POLICY,
        Permission.READ_EVENTS,
        Permission.APPROVE_ACTION,
        Permission.REJECT_ACTION,
        Permission.RUN_ATTACK_SIMULATION,
        Permission.READ_ATTACK_RESULTS,
        Permission.VIEW_METRICS,
        Permission.VIEW_ANALYTICS,
    },
    UserRole.USER: {
        Permission.READ_AGENT,
        Permission.READ_EVENTS,
        Permission.VIEW_METRICS,
    },
}


def has_permission(role: UserRole, permission: Permission) -> bool:
    """Check if a role has a specific permission"""
    return permission in ROLE_PERMISSIONS.get(role, set())


def require_permission(role: UserRole, required_permission: Permission):
    """Raise an exception if the role doesn't have the required permission"""
    if not has_permission(role, required_permission):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Permission '{required_permission.value}' required",
        )


def require_any_permission(role: UserRole, required_permissions: List[Permission]):
    """Raise an exception if the role doesn't have any of the required permissions"""
    if not any(has_permission(role, perm) for perm in required_permissions):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"One of permissions {[p.value for p in required_permissions]} required",
        )
