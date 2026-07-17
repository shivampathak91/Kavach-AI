from typing import list
import google.generativeai as genai
from app.ai.base import BaseAIProvider, Message, AIResponse
from app.config import settings


class GeminiProvider(BaseAIProvider):
    """Google Gemini provider implementation"""
    
    def __init__(self, api_key: str = None, model: str = "gemini-pro"):
        api_key = api_key or settings.GOOGLE_API_KEY
        if not api_key:
            raise ValueError("Google API key is required")
        super().__init__(api_key, model)
        genai.configure(api_key=api_key)
        self.client = genai.GenerativeModel(model)
    
    async def chat_completion(
        self,
        messages: list[Message],
        temperature: float = 0.7,
        max_tokens: int = 1000,
        **kwargs
    ) -> AIResponse:
        # Convert messages to Gemini format
        chat_history = []
        for msg in messages[:-1]:
            if msg.role == "user":
                chat_history.append({"role": "user", "parts": msg.content})
            elif msg.role == "assistant":
                chat_history.append({"role": "model", "parts": msg.content})
        
        chat = self.client.start_chat(history=chat_history)
        response = await chat.send_message(
            messages[-1].content,
            generation_config=genai.types.GenerationConfig(
                temperature=temperature,
                max_output_tokens=max_tokens,
            )
        )
        
        return AIResponse(
            content=response.text,
            model=self.model,
            usage={
                "prompt_tokens": response.usage_metadata.prompt_token_count if hasattr(response, 'usage_metadata') else 0,
                "completion_tokens": response.usage_metadata.candidates_token_count if hasattr(response, 'usage_metadata') else 0,
                "total_tokens": response.usage_metadata.total_token_count if hasattr(response, 'usage_metadata') else 0
            },
            finish_reason=response.candidates[0].finish_reason.name if response.candidates else None
        )
    
    async def get_embeddings(self, texts: list[str]) -> list[list[float]]:
        # Use Google's embedding model
        embedding_model = genai.GenerativeModel('embedding-001')
        embeddings = []
        for text in texts:
            result = embedding_model.embed_content(text)
            embeddings.append(result['embedding'])
        return embeddings
    
    def validate_config(self) -> bool:
        return bool(self.api_key)
