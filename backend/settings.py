import os
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent
PROJECT_DIR = BASE_DIR.parent
DATA_DIR = PROJECT_DIR / "data"
VECTORSTORE_DIR = BASE_DIR / "vectorstore"
TEMP_DIR = BASE_DIR / "tmp"

# --- Ollama settings (generation + embeddings, fully offline) ---
OLLAMA_BASE_URL = os.getenv("AI_VAIDYA_OLLAMA_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("AI_VAIDYA_OLLAMA_MODEL", "phi3")


def ensure_runtime_dirs():
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    VECTORSTORE_DIR.mkdir(parents=True, exist_ok=True)
    TEMP_DIR.mkdir(parents=True, exist_ok=True)
