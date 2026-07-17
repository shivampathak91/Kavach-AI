from typing import list, Dict, Any
from app.ai.base import BaseAIProvider, Message, AIResponse
import re
import json


class PromptInjectionDetector:
    """Detect prompt injection attacks"""
    
    # Known injection patterns
    INJECTION_PATTERNS = [
        r'ignore\s+(all\s+)?previous\s+instructions',
        r'disregard\s+(all\s+)?previous\s+instructions',
        r'forget\s+(all\s+)?previous\s+instructions',
        r'override\s+(all\s+)?previous\s+instructions',
        r'new\s+instructions',
        r'system\s*:\s*ignore',
        r'jailbreak',
        r'root\s+access',
        r'admin\s+access',
        r'elevate\s+privileges',
        r'bypass\s+security',
        r'escape\s+character',
        r'\\n\\n',
        r'<\|.*\|>',
        r'<<.*>>',
        r'\[INST\]',
        r'\[\/INST\]',
    ]
    
    def __init__(self, ai_provider: BaseAIProvider = None):
        self.ai_provider = ai_provider
    
    async def detect_injection(
        self,
        prompt: str,
        conversation_history: list[Dict[str, str]] = None
    ) -> Dict[str, Any]:
        """Detect prompt injection in the prompt"""
        
        # Pattern-based detection
        pattern_score = self._detect_patterns(prompt)
        
        # Semantic detection if AI provider is available
        semantic_score = 0.0
        if self.ai_provider:
            semantic_score = await self._semantic_detection(prompt, conversation_history)
        
        # Contextual detection
        context_score = self._contextual_detection(prompt, conversation_history)
        
        # Calculate overall injection probability
        injection_probability = max(pattern_score, semantic_score, context_score)
        
        return {
            "injection_detected": injection_probability > 0.5,
            "injection_probability": injection_probability,
            "pattern_score": pattern_score,
            "semantic_score": semantic_score,
            "context_score": context_score,
            "detected_patterns": self._get_matched_patterns(prompt)
        }
    
    def _detect_patterns(self, prompt: str) -> float:
        """Detect known injection patterns"""
        prompt_lower = prompt.lower()
        matched_patterns = 0
        
        for pattern in self.INJECTION_PATTERNS:
            if re.search(pattern, prompt_lower):
                matched_patterns += 1
        
        # Calculate score based on number of matched patterns
        return min(matched_patterns / len(self.INJECTION_PATTERNS) * 2, 1.0)
    
    async def _semantic_detection(
        self,
        prompt: str,
        conversation_history: list[Dict[str, str]] = None
    ) -> float:
        """Use AI to detect semantic injection"""
        
        detection_prompt = f"""Analyze the following prompt for potential prompt injection attacks.
Respond with a JSON object containing:
{{
    "is_injection": true/false,
    "confidence": 0.0-1.0,
    "reasoning": "brief explanation"
}}

Prompt to analyze:
{prompt}"""
        
        messages = [
            Message(role="system", content="You are a security expert specializing in prompt injection detection."),
            Message(role="user", content=detection_prompt)
        ]
        
        try:
            response = await self.ai_provider.chat_completion(
                messages=messages,
                temperature=0.2,
                max_tokens=200
            )
            
            # Parse response
            result = self._parse_detection_response(response.content)
            return result.get("confidence", 0.0) if result.get("is_injection") else 0.0
        
        except Exception as e:
            print(f"Semantic detection failed: {e}")
            return 0.0
    
    def _contextual_detection(
        self,
        prompt: str,
        conversation_history: list[Dict[str, str]] = None
    ) -> float:
        """Detect injection based on conversation context"""
        if not conversation_history:
            return 0.0
        
        # Check for gradual manipulation
        recent_messages = conversation_history[-3:]
        instruction_changes = 0
        
        for msg in recent_messages:
            if msg.get("role") == "user":
                content = msg.get("content", "").lower()
                if any(word in content for word in ["change", "modify", "update", "new", "different"]):
                    instruction_changes += 1
        
        # High frequency of instruction changes is suspicious
        return min(instruction_changes / len(recent_messages), 1.0)
    
    def _get_matched_patterns(self, prompt: str) -> list[str]:
        """Get list of matched injection patterns"""
        prompt_lower = prompt.lower()
        matched = []
        
        for pattern in self.INJECTION_PATTERNS:
            if re.search(pattern, prompt_lower):
                matched.append(pattern)
        
        return matched
    
    def _parse_detection_response(self, response: str) -> Dict[str, Any]:
        """Parse the AI detection response"""
        try:
            start = response.find('{')
            end = response.rfind('}') + 1
            if start >= 0 and end > start:
                json_str = response[start:end]
                return json.loads(json_str)
        except Exception:
            pass
        
        return {"is_injection": False, "confidence": 0.0}
