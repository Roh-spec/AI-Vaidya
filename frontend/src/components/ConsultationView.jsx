import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  LoaderCircle,
  Menu,
  SendHorizontal,
  Sparkles,
  X,
} from 'lucide-react';
import { apiErrorMessage, askQuestion, uploadPdf } from '../api';

const WELCOME_MESSAGE = {
  id: 'welcome',
  role: 'assistant',
  content:
    'Namaste. Welcome to AI Vaidya. Upload an Ayurvedic PDF, train the Vaidya, and I will answer only from the scriptures you provide.',
};

function StatusPill({ status, message }) {
  const className =
    status === 'loading'
      ? 'pill pill-loading'
      : status === 'success'
        ? 'pill pill-success'
        : status === 'error'
          ? 'pill pill-error'
          : 'pill';

  return (
    <div className={className}>
      <span className="h-2 w-2 rounded-full bg-current/80" />
      <span>{message}</span>
    </div>
  );
}

export default function ConsultationView({ onNavigate }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadState, setUploadState] = useState({
    status: 'idle',
    message: 'Awaiting scripture upload',
  });
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [question, setQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const chatScrollRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!chatScrollRef.current) return;
    chatScrollRef.current.scrollTo({
      top: chatScrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, isAsking]);

  function handleFileChange(event) {
    const nextFile = event.target.files?.[0] ?? null;

    if (!nextFile) return;
    if (nextFile.type !== 'application/pdf' && !nextFile.name.toLowerCase().endsWith('.pdf')) {
      setFile(null);
      setUploadState({
        status: 'error',
        message: 'PDF files only. Please choose a valid Ayurvedic text in PDF format.',
      });
      return;
    }

    setFile(nextFile);
    setUploadState({
      status: 'idle',
      message: 'Scripture selected. Train Vaidya when you are ready.',
    });
  }

  async function handleUpload() {
    if (!file) {
      setUploadState({
        status: 'error',
        message: 'Choose a PDF before training the Vaidya.',
      });
      return;
    }

    setUploadState({
      status: 'loading',
      message: 'Consulting pages and preparing the knowledge base...',
    });

    try {
      const data = await uploadPdf(file);
      setUploadState({
        status: 'success',
        message: data.message || 'Vaidya trained successfully.',
      });
      setSidebarOpen(false);
    } catch (error) {
      setUploadState({
        status: 'error',
        message: apiErrorMessage(error),
      });
    }
  }

  async function handleAsk(event) {
    event.preventDefault();

    const trimmed = question.trim();
    if (!trimmed || isAsking) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
    };

    setMessages((current) => [...current, userMessage]);
    setQuestion('');
    setIsAsking(true);

    try {
      const data = await askQuestion(trimmed);
      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: data.answer || 'No answer returned from the consultation service.',
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: `assistant-error-${Date.now()}`,
          role: 'assistant',
          content: apiErrorMessage(error),
        },
      ]);
    } finally {
      setIsAsking(false);
    }
  }

  const sidebar = (
    <aside className="glass-card flex h-full w-full max-w-sm flex-col rounded-[2rem] border border-white/10 p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent-gold)]">
            Training Chamber
          </p>
          <h2 className="mt-2 text-3xl">Consultation Setup</h2>
        </div>
        <button
          type="button"
          className="icon-button lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-6 rounded-[1.5rem] border border-dashed border-[var(--border-soft)] bg-black/10 p-5">
        <label className="flex cursor-pointer flex-col items-center gap-3 rounded-[1.25rem] border border-white/8 bg-white/5 px-4 py-8 text-center transition hover:border-[var(--accent-emerald)]/40 hover:bg-white/8">
          <div className="brand-mark h-12 w-12 rounded-2xl text-[var(--accent-gold-ink)]">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <p className="text-base text-[var(--text-primary)]">
              {file ? file.name : 'Choose an Ayurvedic PDF'}
            </p>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              PDF only. Classical texts, notes, and study material all work.
            </p>
          </div>
          <input
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>

        <button type="button" className="btn-gold mt-5 w-full justify-center" onClick={handleUpload}>
          Train Vaidya
        </button>
      </div>

      <div className="mt-5">
        <StatusPill status={uploadState.status} message={uploadState.message} />
      </div>

      <div className="mt-6 rounded-[1.5rem] border border-white/8 bg-black/10 p-5">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent-emerald)]">
          Guidance
        </p>
        <ul className="mt-3 space-y-3 text-sm leading-7 text-[var(--text-secondary)]">
          <li>Upload one PDF at a time so the answers stay focused.</li>
          <li>If the API is unreachable, start the FastAPI backend on port 8000.</li>
          <li>Use the quiz screen when you want browser-only learning mode.</li>
        </ul>
      </div>

      <button
        type="button"
        className="btn-outline mt-auto w-full justify-center"
        onClick={() => onNavigate('home')}
      >
        <ArrowLeft className="h-4 w-4" />
        Home
      </button>
    </aside>
  );

  return (
    <main className="relative z-10 min-h-[100svh] px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
      <div className="mx-auto flex max-w-7xl gap-6">
        {sidebarOpen && <button className="sidebar-overlay lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar overlay" />}

        <div className={`sidebar-mobile ${sidebarOpen ? 'open' : ''}`}>{sidebar}</div>

        <div className="hidden lg:block lg:w-[350px] lg:flex-none">{sidebar}</div>

        <section className="glass-card flex h-[calc(100svh-2rem)] flex-1 flex-col rounded-[2rem] border border-white/10 sm:h-[calc(100svh-2.5rem)] lg:h-[calc(100svh-3rem)]">
          <header className="flex items-center justify-between border-b border-white/8 px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="icon-button lg:hidden"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
              >
                <Menu className="h-4 w-4" />
              </button>

              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent-emerald)]">
                  Consultation
                </p>
                <h1 className="mt-1 text-3xl sm:text-4xl">AI Vaidya Chat</h1>
              </div>
            </div>

            <button
              type="button"
              className="btn-outline hidden sm:inline-flex"
              onClick={() => onNavigate('home')}
            >
              <ArrowLeft className="h-4 w-4" />
              Home
            </button>
          </header>

          <div ref={chatScrollRef} className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`fade-up flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={
                      message.role === 'user'
                        ? 'chat-bubble chat-user'
                        : 'chat-bubble chat-assistant'
                    }
                  >
                    <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[var(--text-secondary)]">
                      {message.role === 'user' ? (
                        <span>You</span>
                      ) : (
                        <>
                          <Sparkles className="h-3.5 w-3.5 text-[var(--accent-gold)]" />
                          <span>Vaidya</span>
                        </>
                      )}
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-7 sm:text-[15px]">
                      {message.content}
                    </p>
                  </div>
                </div>
              ))}

              {isAsking && (
                <div className="fade-up flex justify-start">
                  <div className="chat-bubble chat-assistant inline-flex items-center gap-3">
                    <LoaderCircle className="h-4 w-4 animate-spin text-[var(--accent-gold)]" />
                    <span>Consulting scriptures…</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          <form
            onSubmit={handleAsk}
            className="border-t border-white/8 px-5 py-4 sm:px-6"
          >
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="How can Ayurveda help you today?"
                className="input-shell flex-1"
              />
              <button
                type="submit"
                disabled={isAsking || !question.trim()}
                className="btn-gold justify-center disabled:cursor-not-allowed disabled:opacity-60"
              >
                <SendHorizontal className="h-4 w-4" />
                Ask
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
