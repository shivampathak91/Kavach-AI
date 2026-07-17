from typing import Dict, Any, Optional
from datetime import datetime
import time
import httpx


class MCPInterceptor:
    """Intercept and analyze MCP tool calls"""
    
    def __init__(self, analysis_pipeline, policy_engine, trust_engine):
        self.analysis_pipeline = analysis_pipeline
        self.policy_engine = policy_engine
        self.trust_engine = trust_engine
    
    async def intercept_tool_call(
        self,
        agent_id: str,
        tool_name: str,
        tool_args: Dict[str, Any],
        prompt_context: str,
        conversation_history: list[Dict[str, str]] = None
    ) -> Dict[str, Any]:
        """Intercept and analyze a tool call"""
        
        start_time = time.time()
        
        # Step 1: Intent Analysis
        intent_result = await self.analysis_pipeline.analyze_intent(
            prompt_context, tool_name, tool_args, conversation_history
        )
        
        # Step 2: Prompt Injection Detection
        injection_result = await self.analysis_pipeline.detect_injection(
            prompt_context, conversation_history
        )
        
        # Step 3: Risk Scoring
        agent_trust = await self.trust_engine.get_trust_score(agent_id)
        risk_result = await self.analysis_pipeline.calculate_risk(
            intent_result, injection_result, tool_name, agent_trust
        )
        
        # Step 4: Policy Evaluation
        action = {
            "tool_name": tool_name,
            "tool_args": tool_args,
            "prompt": prompt_context,
            "risk_score": risk_result["risk_score"],
            "intent": intent_result
        }
        
        policy_result = await self.policy_engine.evaluate_action(
            action, agent_id
        )
        
        # Step 5: Make Decision
        decision = self._make_decision(
            risk_result, policy_result, agent_trust
        )
        
        execution_time = int((time.time() - start_time) * 1000)
        
        return {
            "decision": decision["action"],
            "event_id": decision.get("event_id"),
            "risk_score": risk_result["risk_score"],
            "trust_score": agent_trust,
            "execution_time_ms": execution_time,
            "intent_analysis": intent_result,
            "injection_result": injection_result,
            "policy_decision": policy_result,
            "reason": decision.get("reason")
        }
    
    async def forward_to_mcp(
        self,
        tool_name: str,
        tool_args: Dict[str, Any],
        mcp_server_url: str
    ) -> Dict[str, Any]:
        """Forward approved request to MCP server"""
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{mcp_server_url}/tools/{tool_name}",
                    json=tool_args,
                    timeout=30.0
                )
                response.raise_for_status()
                return response.json()
        
        except httpx.TimeoutException:
            return {"error": "MCP server timeout"}
        except httpx.HTTPError as e:
            return {"error": f"MCP server error: {str(e)}"}
        except Exception as e:
            return {"error": f"Unexpected error: {str(e)}"}
    
    def _make_decision(
        self,
        risk_result: Dict[str, Any],
        policy_result: Dict[str, Any],
        agent_trust: float
    ) -> Dict[str, str]:
        """Make final decision based on risk, policy, and trust"""
        
        risk_score = risk_result["risk_score"]
        risk_level = risk_result["risk_level"]
        policy_decision = policy_result["decision"]
        
        # Policy takes precedence
        if policy_decision == "block":
            return {
                "action": "block",
                "reason": "Blocked by policy"
            }
        
        if policy_decision == "require_approval":
            return {
                "action": "require_approval",
                "reason": "Requires human approval per policy"
            }
        
        # Risk-based decision
        if risk_level == "critical":
            return {
                "action": "block",
                "reason": "Critical risk detected"
            }
        
        if risk_level == "high":
            return {
                "action": "require_approval",
                "reason": "High risk requires approval"
            }
        
        if risk_level == "medium" and agent_trust < 0.7:
            return {
                "action": "require_approval",
                "reason": "Medium risk with low trust requires approval"
            }
        
        # Default to allow
        return {
            "action": "allow",
            "reason": "Action allowed"
        }
