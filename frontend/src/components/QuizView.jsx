import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  BadgeCheck,
  BookOpenCheck,
  CircleAlert,
  DatabaseZap,
  RefreshCw,
  Trash2,
  Upload,
} from 'lucide-react';
import { extractTextFromPdf } from '../utils/pdfText';
import { generateQuiz } from '../utils/quizGenerator';
import { clearQuiz, hasSavedQuiz, loadQuiz, saveQuiz } from '../utils/quizStorage';

function buildInitialSession(quiz, sourceName) {
  return {
    sourceName,
    questions: quiz.questions,
    currentIndex: 0,
    answers: [],
    completed: false,
  };
}

function resultCount(session) {
  return session.answers.filter((answer) => answer.isCorrect).length;
}

export default function QuizView({ onNavigate }) {
  const savedQuiz = hasSavedQuiz() ? loadQuiz() : null;
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState({
    tone: 'idle',
    message: 'Upload a PDF to generate a 10-question offline quiz.',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [session, setSession] = useState(savedQuiz);

  const currentQuestion = session?.questions?.[session.currentIndex] ?? null;
  const savedAvailable = useMemo(() => hasSavedQuiz(), [session]);

  function handleFileChange(event) {
    const nextFile = event.target.files?.[0] ?? null;
    if (!nextFile) return;

    if (nextFile.type !== 'application/pdf' && !nextFile.name.toLowerCase().endsWith('.pdf')) {
      setFile(null);
      setStatus({
        tone: 'error',
        message: 'PDF files only. Choose a valid study document to continue.',
      });
      return;
    }

    setFile(nextFile);
    setStatus({
      tone: 'ready',
      message: 'PDF ready. Generate quiz offline when you are ready.',
    });
  }

  async function handleGenerateQuiz() {
    if (!file) {
      setStatus({
        tone: 'error',
        message: 'Choose a PDF before generating a quiz.',
      });
      return;
    }

    setIsGenerating(true);
    setStatus({
      tone: 'loading',
      message: 'Reading the PDF in your browser and composing 10 questions...',
    });

    try {
      const text = await extractTextFromPdf(file);
      const quiz = generateQuiz(text, 10);
      const nextSession = buildInitialSession(quiz, file.name);
      saveQuiz(nextSession);
      setSession(nextSession);
      setStatus({
        tone: 'success',
        message: 'Offline quiz ready. Your questions are saved locally for replay.',
      });
    } catch (error) {
      setStatus({
        tone: 'error',
        message: error.message || 'Unable to generate a quiz from this PDF.',
      });
    } finally {
      setIsGenerating(false);
    }
  }

  function handlePlaySaved() {
    const cached = loadQuiz();
    if (!cached) {
      setStatus({
        tone: 'error',
        message: 'No saved quiz found in local storage.',
      });
      return;
    }

    setSession(cached);
    setStatus({
      tone: 'success',
      message: `Loaded saved quiz from ${cached.sourceName || 'your previous PDF'}.`,
    });
  }

  function handleAnswer(option) {
    if (!session || !currentQuestion) return;

    const alreadyAnswered = session.answers[session.currentIndex];
    if (alreadyAnswered) return;

    const answerRecord = {
      selected: option,
      isCorrect: option === currentQuestion.answer,
    };

    const nextAnswers = [...session.answers];
    nextAnswers[session.currentIndex] = answerRecord;

    const nextSession = {
      ...session,
      answers: nextAnswers,
    };

    setSession(nextSession);
    saveQuiz(nextSession);
  }

  function handleNext() {
    if (!session) return;

    const lastQuestion = session.currentIndex >= session.questions.length - 1;
    const nextSession = lastQuestion
      ? { ...session, completed: true }
      : { ...session, currentIndex: session.currentIndex + 1 };

    setSession(nextSession);
    saveQuiz(nextSession);
  }

  function handleReplay() {
    if (!session) return;
    const nextSession = {
      ...session,
      currentIndex: 0,
      answers: [],
      completed: false,
    };
    setSession(nextSession);
    saveQuiz(nextSession);
    setStatus({
      tone: 'success',
      message: 'Quiz reset. You can play it again from the beginning.',
    });
  }

  function handleNewPdf() {
    setFile(null);
    setSession(null);
    setStatus({
      tone: 'idle',
      message: 'Choose a new PDF to build another offline quiz.',
    });
  }

  function handleClearSaved() {
    clearQuiz();
    setSession(null);
    setStatus({
      tone: 'idle',
      message: 'Saved quiz cleared from this browser.',
    });
  }

  const selectedAnswer = session?.answers?.[session.currentIndex];
  const score = session ? resultCount(session) : 0;

  return (
    <main className="relative z-10 min-h-[100svh] px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="glass-card rounded-[2rem] border border-white/10 px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="pill pill-offline">
                  <DatabaseZap className="h-3.5 w-3.5" />
                  Offline mode
                </span>
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent-gold)]">
                  Quiz Studio
                </p>
              </div>
              <h1 className="mt-3 text-4xl sm:text-5xl">Ayurveda Quiz</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
                This mode never calls the API. The PDF is read in-browser, 10 MCQs
                are generated locally, and the quiz is cached in local storage.
              </p>
            </div>

            <button
              type="button"
              className="btn-outline self-start sm:self-center"
              onClick={() => onNavigate('home')}
            >
              <ArrowLeft className="h-4 w-4" />
              Home
            </button>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[360px,minmax(0,1fr)]">
          <aside className="glass-card rounded-[2rem] border border-white/10 p-5 sm:p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent-emerald)]">
              Source PDF
            </p>

            <label className="mt-5 flex cursor-pointer flex-col items-center gap-3 rounded-[1.5rem] border border-dashed border-[var(--border-soft)] bg-black/10 px-5 py-9 text-center transition hover:border-[var(--accent-emerald)]/40 hover:bg-white/8">
              <div className="brand-mark h-12 w-12 rounded-2xl text-[var(--accent-gold-ink)]">
                <Upload className="h-5 w-5" />
              </div>
              <div>
                <p className="text-base text-[var(--text-primary)]">
                  {file ? file.name : 'Choose a PDF'}
                </p>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  Works fully offline in the browser.
                </p>
              </div>
              <input
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            <button
              type="button"
              className="btn-gold mt-5 w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
              onClick={handleGenerateQuiz}
              disabled={isGenerating}
            >
              <BookOpenCheck className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
              Generate quiz offline
            </button>

            {savedAvailable && (
              <button
                type="button"
                className="btn-outline mt-3 w-full justify-center"
                onClick={handlePlaySaved}
              >
                Play saved quiz
              </button>
            )}

            <div
              className={`mt-5 rounded-[1.5rem] border px-4 py-4 text-sm leading-7 ${
                status.tone === 'error'
                  ? 'border-red-500/25 bg-red-500/10 text-red-100'
                  : status.tone === 'success'
                    ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100'
                    : 'border-white/8 bg-white/5 text-[var(--text-secondary)]'
              }`}
            >
              <div className="flex items-start gap-3">
                {status.tone === 'error' ? (
                  <CircleAlert className="mt-1 h-4 w-4 flex-none" />
                ) : status.tone === 'success' ? (
                  <BadgeCheck className="mt-1 h-4 w-4 flex-none" />
                ) : (
                  <RefreshCw className={`mt-1 h-4 w-4 flex-none ${status.tone === 'loading' ? 'animate-spin' : ''}`} />
                )}
                <p>{status.message}</p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <button type="button" className="secondary-link" onClick={handleReplay} disabled={!session}>
                Replay
              </button>
              <button type="button" className="secondary-link" onClick={handleNewPdf}>
                New PDF
              </button>
              <button type="button" className="secondary-link danger" onClick={handleClearSaved}>
                <Trash2 className="h-4 w-4" />
                Clear saved
              </button>
            </div>
          </aside>

          <section className="glass-card rounded-[2rem] border border-white/10 p-5 sm:p-6">
            {!session && (
              <div className="flex min-h-[420px] items-center justify-center text-center">
                <div className="max-w-xl">
                  <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent-gold)]">
                    Waiting to Begin
                  </p>
                  <h2 className="mt-4 text-4xl">Your quiz will appear here</h2>
                  <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
                    Upload a PDF and generate a quiz offline, or load the saved
                    one if you have already studied this document in the browser.
                  </p>
                </div>
              </div>
            )}

            {session && !session.completed && currentQuestion && (
              <div className="fade-up">
                <div className="flex flex-col gap-4 border-b border-white/8 pb-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent-emerald)]">
                      Question {session.currentIndex + 1} of {session.questions.length}
                    </p>
                    <h2 className="mt-3 text-3xl">Study Round</h2>
                  </div>
                  <div className="rounded-full border border-white/8 bg-white/5 px-4 py-2 text-sm text-[var(--text-secondary)]">
                    Source: {session.sourceName || 'Local PDF'}
                  </div>
                </div>

                <div className="mt-6">
                  <p className="whitespace-pre-wrap text-lg leading-8 text-[var(--text-primary)]">
                    {currentQuestion.question}
                  </p>

                  <div className="mt-6 grid gap-3">
                    {currentQuestion.options.map((option) => {
                      let optionClass = 'quiz-option';
                      if (selectedAnswer) {
                        if (option === currentQuestion.answer) optionClass += ' correct';
                        else if (option === selectedAnswer.selected) optionClass += ' wrong';
                      }

                      return (
                        <button
                          key={option}
                          type="button"
                          className={optionClass}
                          onClick={() => handleAnswer(option)}
                          disabled={Boolean(selectedAnswer)}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>

                  {selectedAnswer && (
                    <div
                      className={`mt-5 rounded-[1.25rem] border px-4 py-4 text-sm leading-7 ${
                        selectedAnswer.isCorrect
                          ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-100'
                          : 'border-red-500/25 bg-red-500/10 text-red-100'
                      }`}
                    >
                      {selectedAnswer.isCorrect
                        ? 'Correct. The answer appears in the uploaded PDF.'
                        : `Not quite. The correct answer is "${currentQuestion.answer}".`}
                    </div>
                  )}

                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      className="btn-gold justify-center disabled:cursor-not-allowed disabled:opacity-60"
                      onClick={handleNext}
                      disabled={!selectedAnswer}
                    >
                      {session.currentIndex === session.questions.length - 1
                        ? 'See results'
                        : 'Next question'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {session?.completed && (
              <div className="fade-up flex min-h-[420px] items-center justify-center">
                <div className="max-w-2xl text-center">
                  <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent-gold)]">
                    Results
                  </p>
                  <h2 className="mt-4 text-5xl">
                    {score} / {session.questions.length}
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
                    You completed the saved offline quiz from{' '}
                    {session.sourceName || 'your local PDF'}. Replay it, load a new
                    document, or clear the cache when you want a fresh start.
                  </p>

                  <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    <button type="button" className="btn-gold justify-center" onClick={handleReplay}>
                      Replay
                    </button>
                    <button type="button" className="btn-outline justify-center" onClick={handleNewPdf}>
                      New PDF
                    </button>
                    <button type="button" className="secondary-link danger justify-center" onClick={handleClearSaved}>
                      Clear saved
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}
