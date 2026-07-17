from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from pydantic import BaseModel


class Message(BaseModel):
    role: str
    content: str


class AIResponse(BaseModel):
    content: str
    model: str
    usage: Optional[Dict[str, int]] = None
    finish_reason: Optional[str] = None


class BaseAIProvider(ABC):
    """Base class for AI providers"""
    
    def __init__(self, api_key: str, model: str):
        self.api_key = api_key
        self.model = model
    
    @abstractmethod
    async def chat_completion(
        self,
        messages: list[Message],
        temperature: float = 0.7,
        max_tokens: int = 1000,
        **kwargs
    ) -> AIResponse:
        """Generate chat completion"""
        pass
    
    @abstractmethod
    async def get_embeddings(self, texts: list[str]) -> list[list[float]]:
        """Get embeddings for texts"""
        pass
    
    @abstractmethod
    def validate_config(self) -> bool:
        """Validate provider configuration"""
        pass
