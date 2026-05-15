import { Suspense, lazy, useState } from 'react';

const HomePage = lazy(() => import('./components/HomePage'));
const ConsultationView = lazy(() => import('./components/ConsultationView'));
const QuizView = lazy(() => import('./components/QuizView'));

const SCREENS = {
  home: 'home',
  consultation: 'consultation',
  quiz: 'quiz',
};

function App() {
  const [screen, setScreen] = useState(SCREENS.home);

  return (
    <div className="app-shell min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <div className="page-orb orb-emerald top-[-12rem] left-[-8rem] h-[24rem] w-[24rem]" />
      <div className="page-orb orb-gold right-[-10rem] top-[10rem] h-[20rem] w-[20rem]" />
      <div className="page-orb orb-teal bottom-[-8rem] left-[20%] h-[18rem] w-[18rem]" />
      <div className="mandala mandala-large" />
      <div className="mandala mandala-small" />

      <Suspense
        fallback={
          <div className="relative z-10 flex min-h-screen items-center justify-center px-6 text-center text-[var(--text-secondary)]">
            Preparing AI Vaidya...
          </div>
        }
      >
        {screen === SCREENS.home && <HomePage onNavigate={setScreen} />}
        {screen === SCREENS.consultation && (
          <ConsultationView onNavigate={setScreen} />
        )}
        {screen === SCREENS.quiz && <QuizView onNavigate={setScreen} />}
      </Suspense>
    </div>
  );
}

export default App;
