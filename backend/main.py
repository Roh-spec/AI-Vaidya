import os
import tempfile

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from ingest import process_and_store_pdf, clear_database
from retriever import retrieve_chunks
from generator import generate_answer
from settings import (
    OLLAMA_BASE_URL,
    OLLAMA_MODEL,
    TEMP_DIR,
    ensure_runtime_dirs,
)

ensure_runtime_dirs()

app = FastAPI(title="AI Vaidya API")

# Allow CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QuestionRequest(BaseModel):
    question: str

@app.get("/health")
def health_check():
    import requests
    ollama_ok = False
    try:
        r = requests.get(f"{OLLAMA_BASE_URL}/api/tags", timeout=3)
        ollama_ok = r.status_code == 200
    except Exception:
        pass

    return {
        "status": "ok",
        "message": "AI Vaidya backend is running (fully offline)",
        "generator": f"Ollama ({OLLAMA_MODEL})",
        "embeddings": f"Ollama ({OLLAMA_MODEL})",
        "ollama_url": OLLAMA_BASE_URL,
        "ollama_connected": ollama_ok,
    }

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    suffix = os.path.splitext(file.filename)[1]
    temp_file = tempfile.NamedTemporaryFile(
        delete=False,
        suffix=suffix,
        dir=TEMP_DIR,
    )
    file_path = temp_file.name
    try:
        content = await file.read()
        temp_file.write(content)
    finally:
        temp_file.close()
        
    try:
        num_chunks = process_and_store_pdf(file_path)
        return {"status": "success", "message": f"Successfully processed {num_chunks} chunks."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Cleanup
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception as e:
                print(f"Warning: Failed to remove temporary file {file_path}: {e}")

@app.post("/ask")
def ask_question(req: QuestionRequest):
    if not req.question:
        raise HTTPException(status_code=400, detail="Question cannot be empty")
        
    try:
        # Retrieve context from uploaded documents
        chunks = retrieve_chunks(req.question)
        
        if not chunks:
            return {
                "answer": "No documents have been uploaded yet. Please upload a PDF first.",
                "sources": [],
            }
        
        # Generate answer strictly from document context
        answer = generate_answer(req.question, chunks)
        
        return {
            "answer": answer,
            "sources": chunks,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/clear")
def clear_db():
    success = clear_database()
    if success:
        return {"status": "success", "message": "Vector database cleared."}
    return {"status": "success", "message": "Vector database was already empty."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
