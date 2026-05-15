import {
  ArrowRight,
  BookOpenText,
  BrainCircuit,
  ScrollText,
} from 'lucide-react';

function FeatureChip({ icon: Icon, label }) {
  return (
    <div className="feature-chip fade-up">
      <Icon className="h-4 w-4 text-[var(--accent-emerald)]" />
      <span>{label}</span>
    </div>
  );
}

export default function HomePage({ onNavigate }) {
  return (
    <main className="relative flex min-h-[100svh] items-center justify-center px-5 py-6 sm:px-8 sm:py-8">
      <section className="hero-panel fade-up relative z-10 mx-auto flex w-full max-w-6xl flex-col overflow-hidden rounded-[2rem] border border-white/10 px-6 py-8 sm:px-10 sm:py-12 lg:px-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,163,80,0.12),transparent_32%),linear-gradient(180deg,rgba(16,45,31,0.65),rgba(7,21,16,0.82))]" />

        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="fade-up inline-flex items-center gap-3 rounded-full border border-[var(--border-soft)] bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.35em] text-[var(--text-secondary)]">
              <div className="brand-mark h-11 w-11 rounded-2xl">
                <span className="text-xl text-[var(--accent-gold-ink)]">AI</span>
              </div>
              <span>Ancient wisdom · Modern intelligence</span>
            </div>

            <h1 className="mt-6 text-6xl leading-none text-[var(--text-primary)] sm:text-7xl lg:text-8xl">
              AI <span className="text-gradient-gold">Vaidya</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--text-secondary)] sm:text-lg">
              Step into an immersive Ayurveda companion that studies your uploaded
              texts, answers with scripture-grounded guidance, and helps you learn
              through an offline quiz crafted directly in the browser.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <FeatureChip icon={ScrollText} label="Upload scriptures" />
              <FeatureChip icon={BrainCircuit} label="Ask Vaidya" />
              <FeatureChip icon={BookOpenText} label="10-question quiz" />
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                onClick={() => onNavigate('consultation')}
                className="btn-gold group justify-center"
              >
                <span>Dive into the World of Ayurveda</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('quiz')}
                className="btn-outline justify-center"
              >
                Take Ayurveda Quiz
              </button>
            </div>
          </div>

          <div className="fade-up fade-up-delay-2 grid gap-4 text-sm text-[var(--text-secondary)] lg:max-w-sm">
            <div className="glass-card rounded-[1.75rem] p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent-gold)]">
                Consultation
              </p>
              <p className="mt-3 leading-7">
                Upload a PDF, train the Vaidya, and ask grounded questions with a
                calm chat interface designed for long reading sessions.
              </p>
            </div>
            <div className="glass-card rounded-[1.75rem] p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent-emerald)]">
                Offline Quiz
              </p>
              <p className="mt-3 leading-7">
                Generate browser-only MCQs from your PDF, get instant feedback,
                and replay saved quizzes without touching the API.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
