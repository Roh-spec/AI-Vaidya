# AI Vaidya — Offline Document Q&A

A fully offline, RAG-based question-answering system. Upload a PDF and ask questions — answers come **only** from your uploaded document, never from the model's training data.

## Architecture

```
┌──────────┐     ┌─────────────────┐     ┌────────────────┐
│ Frontend │────▶│  FastAPI Backend │────▶│  Ollama (phi3)  │
│ (React)  │◀────│  :8000           │◀────│  :11434         │
└──────────┘     └────────┬────────┘     └────────────────┘
                          │
                   ┌──────▼──────┐
                   │  ChromaDB   │
                   │ (vectorstore)│
                   └─────────────┘
```

- **Generation + Embeddings** → Ollama phi3 (local)
- **Vector Store** → ChromaDB (local files)
- **Zero internet required**

---

## Prerequisites (one-time setup, needs internet)

### 1. Install Ollama
Download from https://ollama.com/download/windows and install.

### 2. Pull the phi3 model
```powershell
& "C:\Users\hudge\AppData\Local\Programs\Ollama\ollama.exe" pull phi3
```

### 3. Install Python dependencies
```powershell
cd ai-vaidya
pip install -r requirements.txt
```

### 4. Install Frontend dependencies
```powershell
cd frontend
npm install
```

---

## Running Offline

Ollama auto-starts as a background service on Windows, so you only need **2 terminals**:

### Terminal 1 — Start Backend
```powershell
cd ai-vaidya\backend
py -3 main.py
```
Backend runs on **http://localhost:8000**

### Terminal 2 — Start Frontend
```powershell
cd ai-vaidya\frontend
npm run dev
```
Frontend runs on **http://localhost:5173**

> **Note:** If Ollama is not running as a service, start it manually first:
> ```powershell
> & "C:\Users\hudge\AppData\Local\Programs\Ollama\ollama.exe" serve
> ```

---

## Usage

1. Open **http://localhost:5173** in your browser
2. **Upload a PDF** using the upload area
3. **Ask questions** — the AI answers strictly from the uploaded document
4. Use **Clear** to reset the document database

---

## Project Structure

```
ai-vaidya/
├── backend/
│   ├── main.py               # FastAPI server
│   ├── generator.py           # Ollama-based answer generation
│   ├── ingest.py              # PDF → chunks → ChromaDB
│   ├── retriever.py           # Semantic search over chunks
│   ├── ollama_embeddings.py   # Custom Ollama embedding class
│   └── settings.py            # Configuration
├── frontend/                  # React + Vite UI
├── data/                      # PDF storage
└── requirements.txt           # Python dependencies
```
