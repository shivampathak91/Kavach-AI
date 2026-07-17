import redis.asyncio as redis
from typing import Optional, Any
import json
from app.config import settings


class RedisCache:
    """Redis cache wrapper"""
    
    def __init__(self):
        self.redis: Optional[redis.Redis] = None
    
    async def connect(self):
        """Connect to Redis"""
        self.redis = await redis.from_url(
            settings.REDIS_URL,
            encoding="utf-8",
            decode_responses=True,
            max_connections=settings.REDIS_POOL_SIZE
        )
    
    async def disconnect(self):
        """Disconnect from Redis"""
        if self.redis:
            await self.redis.close()
    
    async def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        if not self.redis:
            return None
        value = await self.redis.get(key)
        if value:
            try:
                return json.loads(value)
            except json.JSONDecodeError:
                return value
        return None
    
    async def set(self, key: str, value: Any, expire: Optional[int] = None) -> bool:
        """Set value in cache"""
        if not self.redis:
            return False
        if isinstance(value, (dict, list)):
            value = json.dumps(value)
        return await self.redis.set(key, value, ex=expire)
    
    async def delete(self, key: str) -> bool:
        """Delete key from cache"""
        if not self.redis:
            return False
        return await self.redis.delete(key) > 0
    
    async def exists(self, key: str) -> bool:
        """Check if key exists"""
        if not self.redis:
            return False
        return await self.redis.exists(key) > 0
    
    async def expire(self, key: str, seconds: int) -> bool:
        """Set expiration on key"""
        if not self.redis:
            return False
        return await self.redis.expire(key, seconds) > 0
    
    async def incr(self, key: str) -> int:
        """Increment value"""
        if not self.redis:
            return 0
        return await self.redis.incr(key)
    
    async def decr(self, key: str) -> int:
        """Decrement value"""
        if not self.redis:
            return 0
        return await self.redis.decr(key)


# Global cache instance
cache = RedisCache()
