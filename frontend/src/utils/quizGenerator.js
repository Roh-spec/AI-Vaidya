function shuffle(items) {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
}

function normalizeSentences(text) {
  return text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length >= 50 && sentence.length <= 260 && /[A-Za-z]/.test(sentence));
}

function extractTerms(text) {
  const stopWords = new Set([
    'about', 'after', 'again', 'because', 'before', 'being', 'between',
    'during', 'first', 'found', 'great', 'other', 'shall', 'since', 'their',
    'there', 'these', 'those', 'through', 'under', 'which', 'while', 'would',
    'according', 'document', 'within', 'where', 'should', 'could', 'every',
  ]);

  const uniqueTerms = new Set();
  const matches = text.match(/\b[A-Za-z][A-Za-z-]{4,}\b/g) ?? [];

  for (const match of matches) {
    const term = match.trim();
    if (!stopWords.has(term.toLowerCase())) uniqueTerms.add(term);
  }

  return [...uniqueTerms];
}

function pickKeyword(sentence, terms) {
  const lowerSentence = sentence.toLowerCase();
  const ranked = terms
    .filter((term) => lowerSentence.includes(term.toLowerCase()))
    .sort((left, right) => right.length - left.length);

  return ranked[0] ?? null;
}

function pickDistractors(answer, termPool, count = 3) {
  const candidates = shuffle(
    termPool.filter((term) => term.toLowerCase() !== answer.toLowerCase()),
  );

  return candidates.slice(0, count);
}

function createFillBlankQuestion(sentence, answer, termPool) {
  const regex = new RegExp(`\\b${answer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
  const blanked = sentence.replace(regex, '_____');
  if (blanked === sentence) return null;

  const distractors = pickDistractors(answer, termPool);
  if (distractors.length < 3) return null;

  return {
    type: 'fill-blank',
    question: `Fill in the blank:\n"${blanked}"`,
    options: shuffle([answer, ...distractors]),
    answer,
  };
}

function createStatementQuestion(sentence, answer, termPool) {
  const distractors = pickDistractors(answer, termPool);
  if (distractors.length < 3) return null;

  return {
    type: 'statement',
    question: `Which term is directly mentioned in this passage?\n"${sentence.slice(0, 170)}${sentence.length > 170 ? '...' : ''}"`,
    options: shuffle([answer, ...distractors]),
    answer,
  };
}

export function generateQuiz(text, count = 10) {
  const sentences = shuffle(normalizeSentences(text));
  const terms = extractTerms(text);

  if (sentences.length < 10) {
    throw new Error('This PDF does not contain enough readable sentences for a 10-question quiz.');
  }

  if (terms.length < 12) {
    throw new Error('Not enough distinct terms were found to build strong multiple-choice options.');
  }

  const questions = [];
  const usedSentences = new Set();

  for (const sentence of sentences) {
    if (questions.length >= count) break;

    const sentenceKey = sentence.slice(0, 80);
    if (usedSentences.has(sentenceKey)) continue;

    const answer = pickKeyword(sentence, terms);
    if (!answer) continue;

    const question =
      questions.length % 2 === 0
        ? createFillBlankQuestion(sentence, answer, terms)
        : createStatementQuestion(sentence, answer, terms);

    if (!question) continue;

    usedSentences.add(sentenceKey);
    questions.push(question);
  }

  if (questions.length < count) {
    throw new Error('The PDF did not provide enough clear passages to generate 10 solid quiz questions.');
  }

  return { questions: questions.slice(0, count) };
}
