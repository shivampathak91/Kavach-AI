from typing import Dict, Any, list
import re
import operator


class PolicyEngine:
    """Evaluate agent actions against security policies"""
    
    # Comparison operators
    OPERATORS = {
        "==": operator.eq,
        "!=": operator.ne,
        ">": operator.gt,
        ">=": operator.ge,
        "<": operator.lt,
        "<=": operator.le,
        "in": lambda a, b: a in b if isinstance(b, (list, tuple, set)) else False,
        "not_in": lambda a, b: a not in b if isinstance(b, (list, tuple, set)) else False,
        "contains": lambda a, b: b in a if isinstance(a, str) else False,
        "matches": lambda a, b: bool(re.match(b, a)) if isinstance(a, str) and isinstance(b, str) else False,
    }
    
    # Policy actions
    ACTIONS = {
        "allow": "allow",
        "block": "block",
        "require_approval": "require_approval",
        "modify": "modify",
        "log": "log"
    }
    
    def __init__(self):
        self.policies = {}  # policy_id -> policy data
    
    async def evaluate_action(
        self,
        action: Dict[str, Any],
        agent_id: str,
        policies: list[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Evaluate action against policies"""
        
        if not policies:
            policies = self._get_active_policies(agent_id)
        
        if not policies:
            # No policies, default to allow
            return {
                "decision": "allow",
                "matched_policy": None,
                "reason": "No applicable policies"
            }
        
        # Sort policies by priority (higher priority first)
        sorted_policies = sorted(policies, key=lambda p: p.get("priority", 0), reverse=True)
        
        # Evaluate each policy
        for policy in sorted_policies:
            if not policy.get("is_active", True):
                continue
            
            result = await self._evaluate_policy(policy, action)
            
            if result["matched"]:
                return {
                    "decision": result["action"],
                    "matched_policy": policy["id"],
                    "reason": result["reason"],
                    "parameters": result.get("parameters")
                }
        
        # No policies matched, default to allow
        return {
            "decision": "allow",
            "matched_policy": None,
            "reason": "No policies matched"
        }
    
    async def _evaluate_policy(
        self,
        policy: Dict[str, Any],
        action: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Evaluate a single policy"""
        
        rules = policy.get("rules", [])
        
        for rule in rules:
            condition = rule.get("condition", "")
            action_type = rule.get("action", "allow")
            parameters = rule.get("parameters", {})
            
            if await self._evaluate_condition(condition, action):
                return {
                    "matched": True,
                    "action": action_type,
                    "reason": f"Policy '{policy['name']}' matched",
                    "parameters": parameters
                }
        
        return {
            "matched": False,
            "action": None,
            "reason": None
        }
    
    async def _evaluate_condition(
        self,
        condition: str,
        action: Dict[str, Any]
    ) -> bool:
        """Evaluate a policy condition"""
        
        try:
            # Parse condition (simple format: field operator value)
            # Example: tool_name == "database_query"
            # Example: risk_score > 0.7
            # Example: tool_name in ["file_delete", "file_write"]
            
            # Extract field, operator, value
            match = re.match(r'(\w+)\s*([=!<>]+|in|not_in|contains|matches)\s*(.+)', condition.strip())
            if not match:
                return False
            
            field = match.group(1)
            op = match.group(2)
            value_str = match.group(3).strip()
            
            # Parse value
            if value_str.startswith('"') and value_str.endswith('"'):
                value = value_str[1:-1]
            elif value_str.startswith('[') and value_str.endswith(']'):
                # Parse list
                value = eval(value_str)
            else:
                # Try to parse as number
                try:
                    value = float(value_str)
                    if value.is_integer():
                        value = int(value)
                except ValueError:
                    value = value_str
            
            # Get field value from action
            field_value = self._get_nested_value(action, field)
            
            # Apply operator
            if op in self.OPERATORS:
                return self.OPERATORS[op](field_value, value)
            
            return False
        
        except Exception as e:
            print(f"Condition evaluation error: {e}")
            return False
    
    def _get_nested_value(self, data: Dict[str, Any], field: str) -> Any:
        """Get nested value from dictionary using dot notation"""
        keys = field.split('.')
        value = data
        
        for key in keys:
            if isinstance(value, dict):
                value = value.get(key)
            else:
                return None
        
        return value
    
    def _get_active_policies(self, agent_id: str) -> list[Dict[str, Any]]:
        """Get active policies for an agent"""
        # In a real implementation, this would query the database
        # For now, return empty list
        return []
    
    async def resolve_conflict(
        self,
        decisions: list[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Resolve conflicts between multiple policy decisions"""
        
        if not decisions:
            return {
                "decision": "allow",
                "reason": "No decisions to resolve"
            }
        
        # Priority order: block > require_approval > modify > allow > log
        priority_order = ["block", "require_approval", "modify", "allow", "log"]
        
        # Find highest priority decision
        for action in priority_order:
            for decision in decisions:
                if decision.get("decision") == action:
                    return decision
        
        # Default to first decision
        return decisions[0]
    
    async def version_policy(
        self,
        policy_id: str,
        changes: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Create a new version of a policy"""
        
        if policy_id not in self.policies:
            raise ValueError(f"Policy {policy_id} not found")
        
        current_policy = self.policies[policy_id]
        
        # Create new version
        new_version = current_policy.copy()
        new_version["version"] = current_policy.get("version", 1) + 1
        new_version.update(changes)
        
        # Store new version
        new_policy_id = f"{policy_id}_v{new_version['version']}"
        self.policies[new_policy_id] = new_version
        
        return new_version
