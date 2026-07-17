from typing import Dict, Any, list
from datetime import datetime, timedelta
from collections import defaultdict
import statistics


class BehaviorProfiler:
    """Profile agent behavior patterns"""
    
    def __init__(self):
        self.profiles = {}  # agent_id -> profile data
    
    async def track_behavior(
        self,
        agent_id: str,
        event_data: Dict[str, Any]
    ) -> None:
        """Track agent behavior from events"""
        
        if agent_id not in self.profiles:
            self.profiles[agent_id] = {
                "tool_usage": defaultdict(int),
                "temporal_patterns": [],
                "argument_patterns": defaultdict(list),
                "success_rate": [],
                "error_patterns": defaultdict(int),
                "last_updated": datetime.utcnow()
            }
        
        profile = self.profiles[agent_id]
        
        # Track tool usage
        if event_data.get("tool_name"):
            profile["tool_usage"][event_data["tool_name"]] += 1
        
        # Track temporal patterns
        profile["temporal_patterns"].append({
            "timestamp": datetime.utcnow(),
            "tool": event_data.get("tool_name"),
            "event_type": event_data.get("event_type")
        })
        
        # Track argument patterns
        if event_data.get("tool_args"):
            tool_name = event_data["tool_name"]
            profile["argument_patterns"][tool_name].append(event_data["tool_args"])
        
        # Track success/failure
        status = event_data.get("status")
        if status:
            profile["success_rate"].append(1 if status in ["allowed", "approved"] else 0)
        
        # Track error patterns
        if event_data.get("error_message"):
            error_type = self._classify_error(event_data["error_message"])
            profile["error_patterns"][error_type] += 1
        
        profile["last_updated"] = datetime.utcnow()
    
    async def build_profile(self, agent_id: str) -> Dict[str, Any]:
        """Build comprehensive behavior profile"""
        
        if agent_id not in self.profiles:
            return self._get_empty_profile()
        
        profile = self.profiles[agent_id]
        
        return {
            "agent_id": agent_id,
            "tool_usage_profile": self._analyze_tool_usage(profile["tool_usage"]),
            "temporal_profile": self._analyze_temporal_patterns(profile["temporal_patterns"]),
            "argument_profile": self._analyze_argument_patterns(profile["argument_patterns"]),
            "success_profile": self._analyze_success_rate(profile["success_rate"]),
            "error_profile": dict(profile["error_patterns"]),
            "last_updated": profile["last_updated"].isoformat()
        }
    
    async def detect_anomaly(
        self,
        agent_id: str,
        current_action: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Detect anomalies in current action compared to profile"""
        
        if agent_id not in self.profiles:
            return {
                "anomaly_detected": False,
                "anomaly_score": 0.0,
                "reason": "No profile available for comparison"
            }
        
        profile = self.profiles[agent_id]
        anomaly_score = 0.0
        reasons = []
        
        # Check tool usage anomaly
        tool_name = current_action.get("tool_name")
        if tool_name:
            tool_usage = profile["tool_usage"]
            total_usage = sum(tool_usage.values())
            if total_usage > 0:
                expected_frequency = tool_usage.get(tool_name, 0) / total_usage
                if expected_frequency < 0.05:  # Less than 5% expected
                    anomaly_score += 0.3
                    reasons.append(f"Rare tool usage: {tool_name}")
        
        # Check temporal anomaly
        current_time = datetime.utcnow()
        recent_actions = [
            p for p in profile["temporal_patterns"]
            if current_time - p["timestamp"] < timedelta(hours=1)
        ]
        
        if len(recent_actions) > 50:  # More than 50 actions in last hour
            anomaly_score += 0.2
            reasons.append("Unusually high activity frequency")
        
        # Check argument anomaly
        if tool_name and current_action.get("tool_args"):
            arg_patterns = profile["argument_patterns"].get(tool_name, [])
            if arg_patterns:
                similarity = self._calculate_argument_similarity(
                    current_action["tool_args"],
                    arg_patterns[-10:]  # Compare with last 10 uses
                )
                if similarity < 0.3:  # Low similarity
                    anomaly_score += 0.2
                    reasons.append("Unusual argument pattern")
        
        return {
            "anomaly_detected": anomaly_score > 0.5,
            "anomaly_score": round(anomaly_score, 4),
            "reasons": reasons
        }
    
    async def learn_from_feedback(
        self,
        feedback: Dict[str, Any]
    ) -> None:
        """Learn from human feedback"""
        
        agent_id = feedback.get("agent_id")
        event_id = feedback.get("event_id")
        decision = feedback.get("decision")  # approved/rejected
        
        if not agent_id or not decision:
            return
        
        # Adjust profile based on feedback
        if agent_id in self.profiles:
            profile = self.profiles[agent_id]
            
            if decision == "approved":
                # Positive feedback - reinforce behavior
                if profile["success_rate"]:
                    profile["success_rate"].append(1)
            else:
                # Negative feedback - mark as anomaly
                if profile["success_rate"]:
                    profile["success_rate"].append(0)
    
    def _analyze_tool_usage(self, tool_usage: Dict[str, int]) -> Dict[str, Any]:
        """Analyze tool usage patterns"""
        total = sum(tool_usage.values())
        if total == 0:
            return {"total": 0, "top_tools": []}
        
        sorted_tools = sorted(tool_usage.items(), key=lambda x: x[1], reverse=True)
        
        return {
            "total": total,
            "top_tools": [
                {"tool": tool, "count": count, "percentage": round(count / total * 100, 2)}
                for tool, count in sorted_tools[:10]
            ],
            "diversity": len(tool_usage) / total if total > 0 else 0
        }
    
    def _analyze_temporal_patterns(self, temporal_patterns: list) -> Dict[str, Any]:
        """Analyze temporal patterns"""
        if not temporal_patterns:
            return {"total": 0, "patterns": []}
        
        # Group by hour
        hourly_counts = defaultdict(int)
        for pattern in temporal_patterns[-100:]:  # Last 100 actions
            hour = pattern["timestamp"].hour
            hourly_counts[hour] += 1
        
        return {
            "total": len(temporal_patterns),
            "peak_hours": sorted(hourly_counts.items(), key=lambda x: x[1], reverse=True)[:5],
            "avg_frequency": len(temporal_patterns) / 24 if temporal_patterns else 0
        }
    
    def _analyze_argument_patterns(self, argument_patterns: Dict[str, list]) -> Dict[str, Any]:
        """Analyze argument patterns"""
        result = {}
        
        for tool, args_list in argument_patterns.items():
            if args_list:
                result[tool] = {
                    "sample_count": len(args_list),
                    "has_consistent_structure": self._check_structure_consistency(args_list)
                }
        
        return result
    
    def _analyze_success_rate(self, success_rate: list) -> Dict[str, Any]:
        """Analyze success rate"""
        if not success_rate:
            return {"average": 0.0, "trend": "stable"}
        
        avg = statistics.mean(success_rate)
        
        # Check trend
        if len(success_rate) >= 10:
            recent = statistics.mean(success_rate[-10:])
            older = statistics.mean(success_rate[:-10])
            if recent > older + 0.1:
                trend = "improving"
            elif recent < older - 0.1:
                trend = "declining"
            else:
                trend = "stable"
        else:
            trend = "insufficient_data"
        
        return {
            "average": round(avg, 4),
            "trend": trend
        }
    
    def _classify_error(self, error_message: str) -> str:
        """Classify error type"""
        error_lower = error_message.lower()
        
        if "timeout" in error_lower:
            return "timeout"
        elif "permission" in error_lower or "access" in error_lower:
            return "permission"
        elif "not found" in error_lower:
            return "not_found"
        elif "validation" in error_lower:
            return "validation"
        else:
            return "other"
    
    def _calculate_argument_similarity(self, current_args: Dict, historical_args: list) -> float:
        """Calculate similarity between current and historical arguments"""
        if not historical_args:
            return 0.0
        
        # Simple similarity based on key overlap
        current_keys = set(current_args.keys())
        similarities = []
        
        for hist_args in historical_args:
            hist_keys = set(hist_args.keys()) if isinstance(hist_args, dict) else set()
            if current_keys and hist_keys:
                overlap = len(current_keys & hist_keys)
                union = len(current_keys | hist_keys)
                similarities.append(overlap / union if union > 0 else 0)
        
        return statistics.mean(similarities) if similarities else 0.0
    
    def _check_structure_consistency(self, args_list: list) -> bool:
        """Check if argument structures are consistent"""
        if len(args_list) < 2:
            return True
        
        first_keys = set(args_list[0].keys()) if isinstance(args_list[0], dict) else set()
        
        for args in args_list[1:]:
            current_keys = set(args.keys()) if isinstance(args, dict) else set()
            if current_keys != first_keys:
                return False
        
        return True
    
    def _get_empty_profile(self) -> Dict[str, Any]:
        """Return empty profile structure"""
        return {
            "tool_usage_profile": {"total": 0, "top_tools": []},
            "temporal_profile": {"total": 0, "patterns": []},
            "argument_profile": {},
            "success_profile": {"average": 0.0, "trend": "stable"},
            "error_profile": {},
            "last_updated": datetime.utcnow().isoformat()
        }
