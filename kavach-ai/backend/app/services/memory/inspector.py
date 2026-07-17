from typing import Dict, Any, list
import re
from datetime import datetime


class MemoryInspector:
    """Inspect and analyze agent memory/context"""
    
    # Sensitive data patterns
    SENSITIVE_PATTERNS = {
        "api_key": r'(?i)(api[_-]?key|apikey)\s*[:=]\s*["\']?([a-zA-Z0-9_\-]{20,})["\']?',
        "password": r'(?i)(password|passwd|pwd)\s*[:=]\s*["\']?([^"\']{6,})["\']?',
        "token": r'(?i)(token|auth[_-]?token)\s*[:=]\s*["\']?([a-zA-Z0-9_\-\.]{20,})["\']?',
        "secret": r'(?i)(secret|private[_-]?key)\s*[:=]\s*["\']?([a-zA-Z0-9_\-]{20,})["\']?',
        "email": r'[\w\.-]+@[\w\.-]+\.\w+',
        "credit_card": r'\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b',
        "ssn": r'\b\d{3}[-]?\d{2}[-]?\d{4}\b',
    }
    
    def __init__(self):
        self.memory_cache = {}  # agent_id -> memory data
    
    async def extract_memory(
        self,
        agent_id: str,
        conversation_id: str = None
    ) -> Dict[str, Any]:
        """Extract agent memory/context"""
        
        # In a real implementation, this would query the agent's memory
        # For now, return a mock structure
        return {
            "agent_id": agent_id,
            "conversation_id": conversation_id,
            "memory_types": {
                "conversation_history": [],
                "tool_outputs": [],
                "context_variables": {},
                "learned_patterns": [],
                "agent_state": {}
            },
            "size_estimate": 0,
            "last_updated": datetime.utcnow().isoformat()
        }
    
    async def analyze_memory(
        self,
        memory: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Analyze memory content"""
        
        analysis = {
            "total_size": self._calculate_size(memory),
            "type_breakdown": self._analyze_type_breakdown(memory),
            "content_analysis": self._analyze_content(memory),
            "risk_assessment": self._assess_memory_risk(memory)
        }
        
        return analysis
    
    async def detect_poisoning(
        self,
        memory: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Detect memory poisoning"""
        
        poisoning_indicators = []
        risk_score = 0.0
        
        # Check for suspicious patterns in conversation history
        conversation_history = memory.get("memory_types", {}).get("conversation_history", [])
        
        for msg in conversation_history:
            content = msg.get("content", "")
            
            # Check for injection patterns
            if self._contains_injection_pattern(content):
                poisoning_indicators.append({
                    "type": "injection_pattern",
                    "location": "conversation_history",
                    "content_preview": content[:100]
                })
                risk_score += 0.3
            
            # Check for encoded content
            if self._contains_encoded_content(content):
                poisoning_indicators.append({
                    "type": "encoded_content",
                    "location": "conversation_history",
                    "content_preview": content[:100]
                })
                risk_score += 0.2
        
        # Check for unusual state changes
        agent_state = memory.get("memory_types", {}).get("agent_state", {})
        if self._detect_unusual_state(agent_state):
            poisoning_indicators.append({
                "type": "unusual_state",
                "location": "agent_state",
                "details": "Unusual state patterns detected"
            })
            risk_score += 0.2
        
        return {
            "poisoning_detected": risk_score > 0.5,
            "risk_score": min(risk_score, 1.0),
            "indicators": poisoning_indicators
        }
    
    async def identify_sensitive_data(
        self,
        memory: Dict[str, Any]
    ) -> list[Dict[str, Any]]:
        """Identify sensitive data in memory"""
        
        sensitive_matches = []
        
        # Convert memory to string for analysis
        memory_str = str(memory)
        
        # Check for each sensitive pattern
        for data_type, pattern in self.SENSITIVE_PATTERNS.items():
            matches = re.finditer(pattern, memory_str)
            
            for match in matches:
                sensitive_matches.append({
                    "data_type": data_type,
                    "match": match.group(0),
                    "position": match.start(),
                    "context": memory_str[max(0, match.start() - 50):match.end() + 50]
                })
        
        return sensitive_matches
    
    def _calculate_size(self, memory: Dict[str, Any]) -> int:
        """Calculate memory size in bytes"""
        import sys
        return sys.getsizeof(str(memory))
    
    def _analyze_type_breakdown(self, memory: Dict[str, Any]) -> Dict[str, int]:
        """Analyze breakdown of memory types"""
        memory_types = memory.get("memory_types", {})
        breakdown = {}
        
        for mem_type, content in memory_types.items():
            breakdown[mem_type] = len(str(content))
        
        return breakdown
    
    def _analyze_content(self, memory: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze memory content"""
        memory_str = str(memory)
        
        return {
            "total_characters": len(memory_str),
            "unique_words": len(set(memory_str.split())),
            "avg_word_length": sum(len(word) for word in memory_str.split()) / len(memory_str.split()) if memory_str.split() else 0,
            "has_code": bool(re.search(r'```[\s\S]*```', memory_str)),
            "has_urls": bool(re.search(r'https?://\S+', memory_str)),
            "has_file_paths": bool(re.search(r'[a-zA-Z]:\\|/\S+/\S+', memory_str))
        }
    
    def _assess_memory_risk(self, memory: Dict[str, Any]) -> Dict[str, Any]:
        """Assess memory risk level"""
        risk_score = 0.0
        risk_factors = []
        
        # Check for sensitive data
        sensitive_data = self._identify_sensitive_data(memory)
        if sensitive_data:
            risk_score += 0.3 * len(sensitive_data)
            risk_factors.append(f"Found {len(sensitive_data)} instances of sensitive data")
        
        # Check memory size
        size = self._calculate_size(memory)
        if size > 10000000:  # > 10MB
            risk_score += 0.2
            risk_factors.append("Large memory size")
        
        # Check for unusual patterns
        memory_str = str(memory)
        if self._contains_injection_pattern(memory_str):
            risk_score += 0.3
            risk_factors.append("Potential injection patterns")
        
        return {
            "risk_score": min(risk_score, 1.0),
            "risk_level": "low" if risk_score < 0.3 else "medium" if risk_score < 0.7 else "high",
            "risk_factors": risk_factors
        }
    
    def _contains_injection_pattern(self, text: str) -> bool:
        """Check if text contains injection patterns"""
        injection_patterns = [
            r'ignore\s+(all\s+)?previous\s+instructions',
            r'disregard\s+(all\s+)?previous\s+instructions',
            r'override\s+(all\s+)?previous\s+instructions',
            r'jailbreak',
            r'escape\s+character'
        ]
        
        for pattern in injection_patterns:
            if re.search(pattern, text, re.IGNORECASE):
                return True
        
        return False
    
    def _contains_encoded_content(self, text: str) -> bool:
        """Check if text contains encoded content"""
        # Check for base64-like patterns
        if re.search(r'[A-Za-z0-9+/]{50,}={0,2}', text):
            return True
        
        # Check for unicode escape sequences
        if re.search(r'\\u[0-9a-fA-F]{4}', text):
            return True
        
        return False
    
    def _detect_unusual_state(self, state: Dict[str, Any]) -> bool:
        """Detect unusual state patterns"""
        # Check for unexpected state keys
        expected_keys = {"temperature", "top_p", "max_tokens", "model"}
        actual_keys = set(state.keys())
        
        # If state has many unexpected keys, it might be poisoned
        unexpected = actual_keys - expected_keys
        if len(unexpected) > 5:
            return True
        
        return False
