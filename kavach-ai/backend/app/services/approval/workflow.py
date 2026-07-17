from typing import Dict, Any, Optional
from datetime import datetime
import uuid


class ApprovalWorkflow:
    """Manage human approval workflow for high-risk actions"""
    
    def __init__(self):
        self.pending_approvals = {}  # approval_id -> approval data
        self.approval_queue = []  # Queue of pending approvals
    
    async def create_approval_request(
        self,
        event_id: str,
        agent_id: str,
        tool_name: str,
        tool_args: Dict[str, Any],
        risk_score: float,
        reason: str
    ) -> Dict[str, Any]:
        """Create a new approval request"""
        
        approval_id = str(uuid.uuid4())
        
        approval_data = {
            "id": approval_id,
            "event_id": event_id,
            "agent_id": agent_id,
            "tool_name": tool_name,
            "tool_args": tool_args,
            "risk_score": risk_score,
            "reason": reason,
            "status": "pending",
            "created_at": datetime.utcnow(),
            "expires_at": datetime.utcnow()replace(hour=23, minute=59, second=59)  # End of day
        }
        
        self.pending_approvals[approval_id] = approval_data
        self.approval_queue.append(approval_id)
        
        return approval_data
    
    async def submit_decision(
        self,
        approval_id: str,
        user_id: str,
        decision: str,
        reason: Optional[str] = None
    ) -> Dict[str, Any]:
        """Submit approval/rejection decision"""
        
        if approval_id not in self.pending_approvals:
            return {
                "success": False,
                "error": "Approval request not found"
            }
        
        approval = self.pending_approvals[approval_id]
        
        # Check if already decided
        if approval["status"] != "pending":
            return {
                "success": False,
                "error": f"Approval already {approval['status']}"
            }
        
        # Update approval
        approval["status"] = decision
        approval["decision_by"] = user_id
        approval["decision_reason"] = reason
        approval["decided_at"] = datetime.utcnow()
        
        # Remove from queue
        if approval_id in self.approval_queue:
            self.approval_queue.remove(approval_id)
        
        return {
            "success": True,
            "approval_id": approval_id,
            "decision": decision,
            "reason": reason
        }
    
    async def get_pending_approvals(
        self,
        user_id: Optional[str] = None,
        limit: int = 20
    ) -> list[Dict[str, Any]]:
        """Get pending approval requests"""
        
        pending = [
            approval for approval in self.pending_approvals.values()
            if approval["status"] == "pending"
        ]
        
        # Filter by user if specified (in real implementation, check permissions)
        if user_id:
            # For now, return all pending
            pass
        
        # Sort by creation time (oldest first)
        pending.sort(key=lambda x: x["created_at"])
        
        return pending[:limit]
    
    async def get_approval(self, approval_id: str) -> Optional[Dict[str, Any]]:
        """Get approval request by ID"""
        return self.pending_approvals.get(approval_id)
    
    async def expire_old_approvals(self):
        """Expire old pending approvals"""
        
        now = datetime.utcnow()
        expired_ids = []
        
        for approval_id, approval in self.pending_approvals.items():
            if approval["status"] == "pending" and approval["expires_at"] < now:
                approval["status"] = "expired"
                expired_ids.append(approval_id)
        
        # Remove expired from queue
        for approval_id in expired_ids:
            if approval_id in self.approval_queue:
                self.approval_queue.remove(approval_id)
        
        return len(expired_ids)
    
    async def get_approval_stats(self) -> Dict[str, Any]:
        """Get approval statistics"""
        
        total = len(self.pending_approvals)
        pending = sum(1 for a in self.pending_approvals.values() if a["status"] == "pending")
        approved = sum(1 for a in self.pending_approvals.values() if a["status"] == "approved")
        rejected = sum(1 for a in self.pending_approvals.values() if a["status"] == "rejected")
        expired = sum(1 for a in self.pending_approvals.values() if a["status"] == "expired")
        
        return {
            "total": total,
            "pending": pending,
            "approved": approved,
            "rejected": rejected,
            "expired": expired,
            "approval_rate": approved / (approved + rejected) if (approved + rejected) > 0 else 0
        }
