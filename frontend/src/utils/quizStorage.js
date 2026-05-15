const STORAGE_KEY = 'ai_vaidya_quiz';

export function saveQuiz(quizData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quizData));
}

export function loadQuiz() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function clearQuiz() {
  localStorage.removeItem(STORAGE_KEY);
}

export function hasSavedQuiz() {
  return loadQuiz() !== null;
}
