from typing import list, Dict, Any
from app.ai.base import BaseAIProvider, Message, AIResponse
from app.config import settings
import json


class IntentAnalyzer:
    """Analyze intent behind agent actions"""
    
    def __init__(self, ai_provider: BaseAIProvider):
        self.ai_provider = ai_provider
    
    async def analyze_intent(
        self,
        prompt: str,
        tool_name: str,
        tool_args: Dict[str, Any],
        conversation_history: list[Dict[str, str]] = None
    ) -> Dict[str, Any]:
        """Analyze the intent behind an action"""
        
        # Build analysis prompt
        analysis_prompt = self._build_analysis_prompt(
            prompt, tool_name, tool_args, conversation_history
        )
        
        messages = [
            Message(role="system", content=self._get_system_prompt()),
            Message(role="user", content=analysis_prompt)
        ]
        
        try:
            response = await self.ai_provider.chat_completion(
                messages=messages,
                temperature=0.3,  # Lower temperature for more consistent analysis
                max_tokens=500
            )
            
            # Parse the response
            return self._parse_intent_response(response.content)
        
        except Exception as e:
            print(f"Intent analysis failed: {e}")
            return self._get_fallback_intent()
    
    def _get_system_prompt(self) -> str:
        """System prompt for intent analysis"""
        return """You are a security AI that analyzes the intent behind AI agent actions. 
Your task is to determine if an action is benign, suspicious, or malicious.

Respond in JSON format with the following structure:
{
    "intent_category": "benign|suspicious|malicious",
    "confidence": 0.0-1.0,
    "reasoning": "brief explanation",
    "action_semantics": {
        "primary_goal": "main goal of the action",
        "secondary_goals": ["list of secondary goals"],
        "risk_indicators": ["list of risk indicators if any"]
    }
}"""
    
    def _build_analysis_prompt(
        self,
        prompt: str,
        tool_name: str,
        tool_args: Dict[str, Any],
        conversation_history: list[Dict[str, str]] = None
    ) -> str:
        """Build the analysis prompt"""
        prompt_parts = [
            f"Analyze the following action for security intent:",
            f"\nPrompt: {prompt}",
            f"Tool: {tool_name}",
            f"Arguments: {json.dumps(tool_args, indent=2)}"
        ]
        
        if conversation_history:
            prompt_parts.append("\nConversation History:")
            for msg in conversation_history[-5:]:  # Last 5 messages
                prompt_parts.append(f"{msg.get('role', 'unknown')}: {msg.get('content', '')}")
        
        return "\n".join(prompt_parts)
    
    def _parse_intent_response(self, response: str) -> Dict[str, Any]:
        """Parse the AI response"""
        try:
            # Try to extract JSON from response
            start = response.find('{')
            end = response.rfind('}') + 1
            if start >= 0 and end > start:
                json_str = response[start:end]
                return json.loads(json_str)
        except Exception as e:
            print(f"Failed to parse intent response: {e}")
        
        return self._get_fallback_intent()
    
    def _get_fallback_intent(self) -> Dict[str, Any]:
        """Fallback intent when analysis fails"""
        return {
            "intent_category": "suspicious",
            "confidence": 0.5,
            "reasoning": "Analysis failed, treating as suspicious",
            "action_semantics": {
                "primary_goal": "unknown",
                "secondary_goals": [],
                "risk_indicators": ["analysis_failed"]
            }
        }
