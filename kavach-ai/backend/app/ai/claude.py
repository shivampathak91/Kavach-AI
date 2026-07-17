from typing import list
from anthropic import AsyncAnthropic
from app.ai.base import BaseAIProvider, Message, AIResponse
from app.config import settings


class ClaudeProvider(BaseAIProvider):
    """Anthropic Claude provider implementation"""
    
    def __init__(self, api_key: str = None, model: str = "claude-3-opus-20240229"):
        api_key = api_key or settings.ANTHROPIC_API_KEY
        if not api_key:
            raise ValueError("Anthropic API key is required")
        super().__init__(api_key, model)
        self.client = AsyncAnthropic(api_key=api_key)
    
    async def chat_completion(
        self,
        messages: list[Message],
        temperature: float = 0.7,
        max_tokens: int = 1000,
        **kwargs
    ) -> AIResponse:
        # Claude expects messages in a specific format
        system_message = None
        claude_messages = []
        
        for msg in messages:
            if msg.role == "system":
                system_message = msg.content
            else:
                claude_messages.append({
                    "role": msg.role,
                    "content": msg.content
                })
        
        response = await self.client.messages.create(
            model=self.model,
            system=system_message,
            messages=claude_messages,
            max_tokens=max_tokens,
            temperature=temperature,
            **kwargs
        )
        
        return AIResponse(
            content=response.content[0].text,
            model=response.model,
            usage={
                "prompt_tokens": response.usage.input_tokens,
                "completion_tokens": response.usage.output_tokens,
                "total_tokens": response.usage.input_tokens + response.usage.output_tokens
            } if response.usage else None,
            finish_reason=response.stop_reason
        )
    
    async def get_embeddings(self, texts: list[str]) -> list[list[float]]:
        # Claude doesn't have a native embeddings API
        # We'll use a placeholder or integrate with another service
        raise NotImplementedError("Claude does not provide embeddings API")
    
    def validate_config(self) -> bool:
        return bool(self.api_key)
