import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()


BASE_DIR = Path(__file__).resolve().parent
PROJECT_DIR = BASE_DIR.parent
DATA_DIR = PROJECT_DIR / "data"
VECTORSTORE_DIR = BASE_DIR / "vectorstore"
TEMP_DIR = BASE_DIR / "tmp"

# --- NVIDIA NIM API Settings ---
NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY", "")
NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1"
NVIDIA_LLM_MODEL = "meta/llama-3.1-70b-instruct"
NVIDIA_EMBEDDING_MODEL = "nvidia/nv-embedqa-e5-v5"


def ensure_runtime_dirs():
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    VECTORSTORE_DIR.mkdir(parents=True, exist_ok=True)
    TEMP_DIR.mkdir(parents=True, exist_ok=True)
