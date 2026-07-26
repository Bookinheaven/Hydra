// Tracks per-key mistake statistics across sessions.
// Persisted to localStorage so the AI engine can analyze weak keys.

const STORAGE_KEY = 'hydra_mistake_stats';

class MistakeTrackerClass {
  constructor() {
    this.stats = this._load();
  }

  _load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return { keyStats: {}, totalTests: 0, totalWords: 0 };
  }

  _save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.stats));
    } catch {}
  }

  // Call this after each completed test with the session and passage data.
  recordSession(session, passage) {
    if (!session || !passage) return;

    this.stats.totalTests++;
    this.stats.totalWords += session.currentWordIndex;

    // Walk through every character that was typed and record per-key stats
    for (const word of passage.words) {
      for (const charObj of word.characters) {
        const expected = charObj.expected.toLowerCase();
        const state = session.characterStates[charObj.globalIndex];
        
        if (!state) continue; // untouched character

        if (!this.stats.keyStats[expected]) {
          this.stats.keyStats[expected] = { correct: 0, incorrect: 0 };
        }

        if (state === 'CORRECT') {
          this.stats.keyStats[expected].correct++;
        } else if (state === 'INCORRECT') {
          this.stats.keyStats[expected].incorrect++;
        }
      }
    }

    this._save();
  }

  // Returns the keys the user struggles with most, sorted by error rate
  getWeakKeys(topN = 8) {
    const entries = Object.entries(this.stats.keyStats)
      .map(([key, { correct, incorrect }]) => {
        const total = correct + incorrect;
        const errorRate = total > 0 ? incorrect / total : 0;
        return { key, correct, incorrect, total, errorRate };
      })
      .filter(e => e.total >= 5) // need at least 5 attempts to be meaningful
      .sort((a, b) => b.errorRate - a.errorRate);

    return entries.slice(0, topN);
  }

  // Returns the weak key letters as a string for the AI endpoint
  getWeakKeyLetters(topN = 6) {
    return this.getWeakKeys(topN).map(e => e.key).join('');
  }

  // Returns full stats for the profile/stats display
  getFullStats() {
    return {
      totalTests: this.stats.totalTests,
      totalWords: this.stats.totalWords,
      weakKeys: this.getWeakKeys(10),
      keyStats: this.stats.keyStats,
    };
  }

  // Reset all tracked data
  reset() {
    this.stats = { keyStats: {}, totalTests: 0, totalWords: 0 };
    this._save();
  }
}

export const MistakeTracker = new MistakeTrackerClass();
