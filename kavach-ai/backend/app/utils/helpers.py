from typing import Any, Dict, List
from datetime import datetime
import uuid


def generate_id() -> str:
    """Generate a unique ID"""
    return str(uuid.uuid4())


def timestamp_now() -> str:
    """Get current timestamp as ISO string"""
    return datetime.utcnow().isoformat()


def sanitize_input(data: Any) -> Any:
    """Sanitize input data"""
    if isinstance(data, str):
        return data.strip()
    elif isinstance(data, dict):
        return {k: sanitize_input(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [sanitize_input(item) for item in data]
    return data


def mask_sensitive_data(data: str, mask_char: str = "*", visible_chars: int = 4) -> str:
    """Mask sensitive data like API keys"""
    if len(data) <= visible_chars:
        return mask_char * len(data)
    return data[:visible_chars] + mask_char * (len(data) - visible_chars)


def calculate_percentage(value: int, total: int) -> float:
    """Calculate percentage"""
    if total == 0:
        return 0.0
    return (value / total) * 100


def safe_divide(numerator: float, denominator: float, default: float = 0.0) -> float:
    """Safely divide two numbers"""
    if denominator == 0:
        return default
    return numerator / denominator


def merge_dicts(*dicts: Dict) -> Dict:
    """Merge multiple dictionaries"""
    result = {}
    for d in dicts:
        result.update(d)
    return result


def chunk_list(items: List, chunk_size: int) -> List[List]:
    """Split a list into chunks"""
    return [items[i:i + chunk_size] for i in range(0, len(items), chunk_size)]
