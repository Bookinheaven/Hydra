import { api } from '../shared/services/apiClient.js';
import wordsData from '../data/words.json';

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Inject numbers into an existing word array at ~18% density
function injectNumbers(words) {
  const numList = wordsData.numbers;
  for (let i = 0; i < words.length; i++) {
    if (Math.random() < 0.18) {
      words[i] = pickRandom(numList);
    }
  }
  return words;
}

// Apply punctuation as inline modifications to existing words
function applyPunctuation(words) {
  const endPuncs = ['.', '!', '?'];
  const midPuncs = [',', ';', ':'];
  let capitalizeNext = true;

  for (let i = 0; i < words.length; i++) {
    if (capitalizeNext && words[i].length > 0 && /[a-zA-Z]/.test(words[i][0])) {
      words[i] = words[i][0].toUpperCase() + words[i].slice(1);
      capitalizeNext = false;
    }

    if (i > 0 && i < words.length - 1) {
      const roll = Math.random();
      if (roll < 0.08) {
        words[i] = words[i] + pickRandom(endPuncs);
        capitalizeNext = true;
      } else if (roll < 0.20) {
        words[i] = words[i] + pickRandom(midPuncs);
      }
    }
  }

  const last = words[words.length - 1];
  if (!/[.!?]$/.test(last)) {
    words[words.length - 1] = last + '.';
  }
  return words;
}

// Generate a passage from local JSON data — instant, synchronous
function generateLocal(wordCount, options = {}) {
  const { punctuation = false, numbers = false } = options;
  const wordList = wordsData.common;

  let words = [];
  for (let i = 0; i < wordCount; i++) {
    words.push(pickRandom(wordList));
  }

  if (numbers) words = injectNumbers(words);
  if (punctuation) words = applyPunctuation(words);

  return words.join(' ');
}

export function generateLocalText(mode, value, options = {}) {
  const { punctuation = false, numbers = false } = options;

  if (mode === 'quote') {
    const quotes = wordsData.quotes || [];
    let quote = pickRandom(quotes) || "The only limit to our realization of tomorrow will be our doubts of today.";
    // Apply modifiers to quotes too
    let words = quote.split(' ');
    if (numbers) words = injectNumbers(words);
    // Don't re-apply punctuation to quotes — they already have natural punctuation
    return words.join(' ');
  }

  let wordCount = 50;
  if (mode === 'words') {
    wordCount = typeof value === 'number' ? value : 25;
  } else if (mode === 'time') {
    wordCount = (typeof value === 'number' ? value : 30) * 8;
  } else if (mode === 'ai') {
    wordCount = typeof value === 'number' ? value : 30;
  }

  return generateLocal(wordCount, { punctuation, numbers });
}

export async function fetchPassageText(mode, value, options = {}) {
  // For all non-AI modes: instant synchronous generation
  if (mode !== 'ai') {
    return generateLocalText(mode, value, options);
  }

  // AI mode: try FastAPI backend with strict timeout
  const wordCount = typeof value === 'number' ? value : 30;
  try {
    const aiPromise = api.ai.generate({ words: wordCount });
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), 800)
    );

    const data = await Promise.race([aiPromise, timeoutPromise]);
    if (data && data.text && data.text.trim().length > 0) {
      // Apply modifiers to AI text too
      let words = data.text.split(' ');
      if (options.numbers) words = injectNumbers(words);
      if (options.punctuation) words = applyPunctuation(words);
      return words.join(' ');
    }
  } catch {
    // Silent fallback
  }

  return generateLocalText(mode, value, options);
}
