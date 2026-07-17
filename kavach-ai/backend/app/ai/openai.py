from typing import list
from openai import AsyncOpenAI
from app.ai.base import BaseAIProvider, Message, AIResponse
from app.config import settings


class OpenAIProvider(BaseAIProvider):
    """OpenAI provider implementation"""
    
    def __init__(self, api_key: str = None, model: str = "gpt-4"):
        api_key = api_key or settings.OPENAI_API_KEY
        if not api_key:
            raise ValueError("OpenAI API key is required")
        super().__init__(api_key, model)
        self.client = AsyncOpenAI(api_key=api_key)
    
    async def chat_completion(
        self,
        messages: list[Message],
        temperature: float = 0.7,
        max_tokens: int = 1000,
        **kwargs
    ) -> AIResponse:
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": m.role, "content": m.content} for m in messages],
            temperature=temperature,
            max_tokens=max_tokens,
            **kwargs
        )
        
        return AIResponse(
            content=response.choices[0].message.content,
            model=response.model,
            usage={
                "prompt_tokens": response.usage.prompt_tokens,
                "completion_tokens": response.usage.completion_tokens,
                "total_tokens": response.usage.total_tokens
            } if response.usage else None,
            finish_reason=response.choices[0].finish_reason
        )
    
    async def get_embeddings(self, texts: list[str]) -> list[list[float]]:
        response = await self.client.embeddings.create(
            model="text-embedding-ada-002",
            input=texts
        )
        return [item.embedding for item in response.data]
    
    def validate_config(self) -> bool:
        return bool(self.api_key)
