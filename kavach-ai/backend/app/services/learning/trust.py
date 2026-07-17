from typing import Dict, Any, list
from datetime import datetime, timedelta
from decimal import Decimal


class TrustEngine:
    """Calculate and maintain dynamic trust scores for agents"""
    
    # Trust factors weights
    TRUST_WEIGHTS = {
        "success_rate": 0.3,
        "policy_compliance": 0.2,
        "risk_score": 0.2,
        "approval_rate": 0.15,
        "consistency": 0.15,
    }
    
    # Decay rate per day (5%)
    DECAY_RATE = 0.05
    
    def __init__(self):
        self.trust_scores = {}  # agent_id -> trust data
    
    async def calculate_trust(
        self,
        agent_id: str,
        recent_events: list[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Calculate trust score for an agent"""
        
        if not recent_events:
            # Return default trust score for new agents
            return {
                "agent_id": agent_id,
                "trust_score": 0.5,
                "factors": {
                    "success_rate": 0.5,
                    "policy_compliance": 0.5,
                    "risk_score": 0.5,
                    "approval_rate": 0.5,
                    "consistency": 0.5
                },
                "trend": "stable"
            }
        
        # Calculate individual trust factors
        success_rate = self._calculate_success_rate(recent_events)
        policy_compliance = self._calculate_policy_compliance(recent_events)
        risk_score = self._calculate_risk_factor(recent_events)
        approval_rate = self._calculate_approval_rate(recent_events)
        consistency = self._calculate_consistency(recent_events)
        
        # Calculate weighted trust score
        trust_score = (
            success_rate * self.TRUST_WEIGHTS["success_rate"] +
            policy_compliance * self.TRUST_WEIGHTS["policy_compliance"] +
            risk_score * self.TRUST_WEIGHTS["risk_score"] +
            approval_rate * self.TRUST_WEIGHTS["approval_rate"] +
            consistency * self.TRUST_WEIGHTS["consistency"]
        )
        
        # Ensure score is between 0 and 1
        trust_score = max(0.0, min(1.0, trust_score))
        
        # Determine trend
        trend = self._calculate_trend(agent_id, trust_score)
        
        # Store trust score
        self.trust_scores[agent_id] = {
            "score": trust_score,
            "factors": {
                "success_rate": success_rate,
                "policy_compliance": policy_compliance,
                "risk_score": risk_score,
                "approval_rate": approval_rate,
                "consistency": consistency
            },
            "trend": trend,
            "last_updated": datetime.utcnow()
        }
        
        return self.trust_scores[agent_id]
    
    async def update_trust(
        self,
        agent_id: str,
        action_outcome: Dict[str, Any]
    ) -> None:
        """Update trust score based on action outcome"""
        
        if agent_id not in self.trust_scores:
            return
        
        trust_data = self.trust_scores[agent_id]
        current_score = trust_data["score"]
        
        # Adjust trust based on outcome
        status = action_outcome.get("status")
        risk_score = action_outcome.get("risk_score", 0.5)
        
        if status in ["allowed", "approved"]:
            # Positive outcome - increase trust slightly
            adjustment = 0.01 * (1.0 - risk_score)
            new_score = min(1.0, current_score + adjustment)
        elif status == "blocked":
            # Negative outcome - decrease trust significantly
            adjustment = 0.05 * risk_score
            new_score = max(0.0, current_score - adjustment)
        else:
            # Neutral outcome - no change
            new_score = current_score
        
        trust_data["score"] = new_score
        trust_data["last_updated"] = datetime.utcnow()
    
    async def apply_decay(self, agent_id: str) -> None:
        """Apply temporal decay to trust score"""
        
        if agent_id not in self.trust_scores:
            return
        
        trust_data = self.trust_scores[agent_id]
        last_updated = trust_data["last_updated"]
        
        # Calculate days since last update
        days_since_update = (datetime.utcnow() - last_updated).days
        
        if days_since_update > 0:
            # Apply decay
            decay_factor = (1 - self.DECAY_RATE) ** days_since_update
            trust_data["score"] = trust_data["score"] * decay_factor
            trust_data["last_updated"] = datetime.utcnow()
    
    async def get_trust_trend(self, agent_id: str) -> Dict[str, Any]:
        """Get trust score trend over time"""
        
        if agent_id not in self.trust_scores:
            return {
                "agent_id": agent_id,
                "trend": "unknown",
                "current_score": 0.5,
                "history": []
            }
        
        trust_data = self.trust_scores[agent_id]
        
        return {
            "agent_id": agent_id,
            "trend": trust_data["trend"],
            "current_score": trust_data["score"],
            "factors": trust_data["factors"],
            "last_updated": trust_data["last_updated"].isoformat()
        }
    
    def _calculate_success_rate(self, events: list[Dict[str, Any]]) -> float:
        """Calculate success rate from events"""
        successful = sum(1 for e in events if e.get("status") in ["allowed", "approved"])
        total = len(events)
        return successful / total if total > 0 else 0.5
    
    def _calculate_policy_compliance(self, events: list[Dict[str, Any]]) -> float:
        """Calculate policy compliance rate"""
        compliant = sum(1 for e in events if e.get("policy_decision") == "allow")
        total = sum(1 for e in events if e.get("policy_decision") is not None)
        return compliant / total if total > 0 else 0.5
    
    def _calculate_risk_factor(self, events: list[Dict[str, Any]]) -> float:
        """Calculate risk factor (inverse of average risk score)"""
        risk_scores = [e.get("risk_score", 0.5) for e in events if e.get("risk_score") is not None]
        if not risk_scores:
            return 0.5
        
        avg_risk = sum(risk_scores) / len(risk_scores)
        return 1.0 - avg_risk
    
    def _calculate_approval_rate(self, events: list[Dict[str, Any]]) -> float:
        """Calculate human approval rate"""
        approvals = sum(1 for e in events if e.get("status") == "approved")
        required_approvals = sum(1 for e in events if e.get("human_approval_required"))
        
        if required_approvals == 0:
            return 0.5  # No approvals required, neutral score
        
        return approvals / required_approvals
    
    def _calculate_consistency(self, events: list[Dict[str, Any]]) -> float:
        """Calculate behavior consistency"""
        if len(events) < 10:
            return 0.5  # Not enough data
        
        # Check consistency of tool usage
        tools = [e.get("tool_name") for e in events if e.get("tool_name")]
        if not tools:
            return 0.5
        
        # Calculate diversity (inverse of consistency)
        unique_tools = len(set(tools))
        total_tools = len(tools)
        
        # High diversity = low consistency
        diversity = unique_tools / total_tools if total_tools > 0 else 0
        consistency = 1.0 - diversity
        
        return consistency
    
    def _calculate_trend(self, agent_id: str, current_score: float) -> str:
        """Calculate trust score trend"""
        
        if agent_id not in self.trust_scores:
            return "stable"
        
        previous_score = self.trust_scores[agent_id]["score"]
        difference = current_score - previous_score
        
        if difference > 0.05:
            return "improving"
        elif difference < -0.05:
            return "declining"
        else:
            return "stable"
