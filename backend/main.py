import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Import our logic
from ingest import process_and_store_pdf, clear_database
from retriever import retrieve_chunks
from generator import generate_answer

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
    return {"status": "ok", "message": "AI Vaidya backend is running"}

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
        
    # Save the file temporarily
    file_path = f"temp_{file.filename}"
    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
        
    try:
        # Process and store
        num_chunks = process_and_store_pdf(file_path)
        return {"status": "success", "message": f"Successfully processed {num_chunks} chunks."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Cleanup
        if os.path.exists(file_path):
            os.remove(file_path)

@app.post("/ask")
def ask_question(req: QuestionRequest):
    if not req.question:
        raise HTTPException(status_code=400, detail="Question cannot be empty")
        
    try:
        # Retrieve context
        chunks = retrieve_chunks(req.question)
        
        # Generate answer
        answer = generate_answer(req.question, chunks)
        
        return {
            "answer": answer,
            "sources": chunks,
            "confidence_score": 0.9 # Placeholder
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
