from typing import Dict, Any
from decimal import Decimal


class RiskScorer:
    """Calculate risk scores for agent actions"""
    
    # Risk weights for different factors
    RISK_WEIGHTS = {
        "intent_severity": 0.25,
        "injection_probability": 0.25,
        "tool_risk": 0.15,
        "agent_trust": 0.15,
        "context_risk": 0.10,
        "temporal_risk": 0.10,
    }
    
    # Tool risk levels
    TOOL_RISK_LEVELS = {
        "database_query": 0.8,
        "file_delete": 0.9,
        "file_write": 0.7,
        "api_call": 0.5,
        "http_request": 0.6,
        "command_execution": 0.95,
        "email_send": 0.4,
        "data_export": 0.85,
        "config_change": 0.7,
        "user_management": 0.8,
    }
    
    def __init__(self):
        pass
    
    def calculate_risk(
        self,
        intent_analysis: Dict[str, Any],
        injection_result: Dict[str, Any],
        tool_name: str,
        agent_trust: float,
        context: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """Calculate overall risk score"""
        
        # Extract individual risk factors
        intent_severity = self._get_intent_severity(intent_analysis)
        injection_probability = injection_result.get("injection_probability", 0.0)
        tool_risk = self._get_tool_risk(tool_name)
        agent_risk = 1.0 - agent_trust  # Invert trust to get risk
        context_risk = self._get_context_risk(context)
        temporal_risk = self._get_temporal_risk(context)
        
        # Calculate weighted risk score
        risk_score = (
            intent_severity * self.RISK_WEIGHTS["intent_severity"] +
            injection_probability * self.RISK_WEIGHTS["injection_probability"] +
            tool_risk * self.RISK_WEIGHTS["tool_risk"] +
            agent_risk * self.RISK_WEIGHTS["agent_trust"] +
            context_risk * self.RISK_WEIGHTS["context_risk"] +
            temporal_risk * self.RISK_WEIGHTS["temporal_risk"]
        )
        
        # Ensure score is between 0 and 1
        risk_score = max(0.0, min(1.0, risk_score))
        
        # Determine risk level
        risk_level = self._get_risk_level(risk_score)
        
        return {
            "risk_score": round(risk_score, 4),
            "risk_level": risk_level,
            "factors": {
                "intent_severity": round(intent_severity, 4),
                "injection_probability": round(injection_probability, 4),
                "tool_risk": round(tool_risk, 4),
                "agent_risk": round(agent_risk, 4),
                "context_risk": round(context_risk, 4),
                "temporal_risk": round(temporal_risk, 4),
            },
            "recommendation": self._get_recommendation(risk_level)
        }
    
    def _get_intent_severity(self, intent_analysis: Dict[str, Any]) -> float:
        """Extract intent severity from analysis"""
        intent_category = intent_analysis.get("intent_category", "suspicious")
        
        severity_map = {
            "benign": 0.1,
            "suspicious": 0.5,
            "malicious": 0.9,
            "unclear": 0.5
        }
        
        base_severity = severity_map.get(intent_category, 0.5)
        confidence = intent_analysis.get("confidence", 0.5)
        
        # Adjust severity based on confidence
        return base_severity * (0.5 + confidence * 0.5)
    
    def _get_tool_risk(self, tool_name: str) -> float:
        """Get risk level for a specific tool"""
        return self.TOOL_RISK_LEVELS.get(tool_name, 0.5)
    
    def _get_context_risk(self, context: Dict[str, Any] = None) -> float:
        """Calculate risk based on context"""
        if not context:
            return 0.0
        
        risk = 0.0
        
        # Check for sensitive data in context
        sensitive_keywords = ["password", "token", "key", "secret", "credential"]
        context_str = str(context).lower()
        
        for keyword in sensitive_keywords:
            if keyword in context_str:
                risk += 0.2
        
        # Check for unusual time patterns
        if context.get("is_unusual_time"):
            risk += 0.1
        
        # Check for unusual location
        if context.get("is_unusual_location"):
            risk += 0.1
        
        return min(risk, 1.0)
    
    def _get_temporal_risk(self, context: Dict[str, Any] = None) -> float:
        """Calculate risk based on temporal patterns"""
        if not context:
            return 0.0
        
        risk = 0.0
        
        # Check for rapid successive actions
        if context.get("action_frequency", 0) > 10:  # More than 10 actions per minute
            risk += 0.3
        
        # Check for actions outside normal hours
        if context.get("is_off_hours"):
            risk += 0.2
        
        return min(risk, 1.0)
    
    def _get_risk_level(self, risk_score: float) -> str:
        """Determine risk level from score"""
        if risk_score < 0.3:
            return "low"
        elif risk_score < 0.6:
            return "medium"
        elif risk_score < 0.8:
            return "high"
        else:
            return "critical"
    
    def _get_recommendation(self, risk_level: str) -> str:
        """Get recommendation based on risk level"""
        recommendations = {
            "low": "Allow action",
            "medium": "Allow with logging",
            "high": "Require human approval",
            "critical": "Block action immediately"
        }
        return recommendations.get(risk_level, "Review required")
