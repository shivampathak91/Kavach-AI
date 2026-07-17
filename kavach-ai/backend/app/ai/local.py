from typing import list
from sentence_transformers import SentenceTransformer
import numpy as np
from app.ai.base import BaseAIProvider, Message, AIResponse
from app.config import settings


class LocalAIProvider(BaseAIProvider):
    """Local AI provider using sentence-transformers for embeddings"""
    
    def __init__(self, model_path: str = None):
        model_path = model_path or settings.LOCAL_AI_MODEL_PATH
        super().__init__("local", model_path)
        self.model = None
        self.embedding_model = None
    
    def _load_models(self):
        """Load models lazily"""
        if self.embedding_model is None:
            try:
                self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
            except Exception as e:
                print(f"Failed to load local embedding model: {e}")
    
    async def chat_completion(
        self,
        messages: list[Message],
        temperature: float = 0.7,
        max_tokens: int = 1000,
        **kwargs
    ) -> AIResponse:
        """Local AI doesn't support chat completion - use external providers"""
        raise NotImplementedError("Local AI provider only supports embeddings")
    
    async def get_embeddings(self, texts: list[str]) -> list[list[float]]:
        """Get embeddings using local model"""
        self._load_models()
        if self.embedding_model is None:
            raise RuntimeError("Embedding model not loaded")
        
        embeddings = self.embedding_model.encode(texts, convert_to_numpy=True)
        return embeddings.tolist()
    
    def validate_config(self) -> bool:
        return True  # Local models don't require API keys
