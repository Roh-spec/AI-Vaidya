# 🌿 AI Vaidya - Ayurveda Q&A Assistant

AI Vaidya is a completely local, privacy-first AI Assistant designed to answer questions about Ayurveda based exclusively on provided classical texts or documents.

This project was built during the AI Fusion Challenge Hackathon.

## Architecture

- **Frontend (`/frontend`)**: Modern React interface built with Vite and styled with Tailwind CSS v4. Features a dark-glassmorphic aesthetic.
- **Backend (`/backend`)**: FastAPI application serving a REST API.
- **AI Stack**: 100% local processing.
  - Embeddings: `sentence-transformers` (`all-MiniLM-L6-v2`)
  - Vector Store: `ChromaDB`
  - Generation: HuggingFace `transformers` (`google/flan-t5-base`)

## Prerequisites

- Node.js (v18+)
- Python (3.10+)

## Setup & Running Locally

You will need to run both the frontend and backend servers simultaneously.

### 1. Start the Backend

Open a terminal in the root directory:
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
*(Note: On the first run, the AI models (~1GB total) will be downloaded automatically.)*

### 2. Start the Frontend

Open a second terminal in the root directory:
```bash
cd frontend
npm install
npm run dev
```

### 3. Usage
- Navigate to `http://localhost:5173` in your browser.
- Upload an Ayurveda PDF document to initialize the knowledge base.
- Ask questions in the terminal chat window!
