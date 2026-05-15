# AI Vaidya

AI Vaidya is an Ayurveda study app with:

- `backend/`: FastAPI consultation API with PDF upload, Chroma persistence, and scripture-grounded question answering
- `frontend/`: React + Vite + Tailwind UI with a dark Ayurveda consultation flow and a fully offline quiz mode

## Project Layout

```text
ai-vaidya/
├── backend/
│   ├── main.py
│   ├── quiz_generator.py
│   ├── requirements.txt
│   └── chroma_db/
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── api.js
│   │   ├── index.css
│   │   ├── components/
│   │   │   ├── HomePage.jsx
│   │   │   ├── ConsultationView.jsx
│   │   │   └── QuizView.jsx
│   │   └── utils/
│   │       ├── pdfText.js
│   │       ├── quizGenerator.js
│   │       └── quizStorage.js
│   └── vite.config.js
└── .gitignore
```

## Backend

Use Python `3.11` or `3.12` in a virtual environment inside `backend/`.

```powershell
cd backend
py -3.11 -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend URL: `http://localhost:8000`

Expected backend behavior:

- `POST /upload`: accepts PDF only, chunks with LangChain `RecursiveCharacterTextSplitter` using `1000/200`, replaces the Chroma index in `chroma_db/`
- `POST /ask`: receives `{ question }`, retrieves top 3 chunks, answers using `google/flan-t5-base`
- `POST /quiz/generate`: optional backend quiz endpoint

## Frontend

```powershell
cd frontend
npm install
npm run dev
```

Frontend URL: `http://localhost:5173`

The Vite dev server proxies `/api` to `http://localhost:8000`.

## Frontend Features

- Home landing page with Ayurveda-themed visuals and direct entry points
- Consultation mode that uses Axios and the backend API
- Offline quiz mode that uses `pdfjs-dist` in the browser only
- Local quiz persistence with replay and clear actions

## Notes

- Consultation shows a clear backend-start message if the API is unreachable.
- Quiz mode validates PDF input and handles empty or very short PDFs.
- The frontend does not call the backend for quiz generation.
