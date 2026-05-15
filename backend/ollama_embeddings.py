"""
Custom Ollama-based embeddings that implement the LangChain Embeddings interface.
This keeps the entire pipeline offline — no HuggingFace downloads needed.
"""
import requests
from typing import List
from langchain_core.embeddings import Embeddings
from settings import OLLAMA_BASE_URL, OLLAMA_MODEL


class OllamaEmbeddings(Embeddings):
    """Generate embeddings using the local Ollama server."""

    def __init__(self, base_url: str = None, model: str = None):
        self.base_url = base_url or OLLAMA_BASE_URL
        self.model = model or OLLAMA_MODEL

    def _embed(self, texts: List[str]) -> List[List[float]]:
        """Call Ollama's /api/embed endpoint."""
        response = requests.post(
            f"{self.base_url}/api/embed",
            json={"model": self.model, "input": texts},
            timeout=120,
        )
        response.raise_for_status()
        return response.json()["embeddings"]

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        """Embed a list of document texts."""
        # Process in batches to avoid overwhelming Ollama
        all_embeddings = []
        batch_size = 10
        for i in range(0, len(texts), batch_size):
            batch = texts[i : i + batch_size]
            all_embeddings.extend(self._embed(batch))
        return all_embeddings

    def embed_query(self, text: str) -> List[float]:
        """Embed a single query text."""
        return self._embed([text])[0]
