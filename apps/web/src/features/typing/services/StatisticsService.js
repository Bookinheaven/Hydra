import { SessionStatus } from '../models/Session.js';

export const StatisticsService = {
  calculateStats(session, passage) {
    const elapsedMinutes = this._getElapsedMinutes(session);
    if (elapsedMinutes === 0) {
      return { wpm: 0, rawWpm: 0, accuracy: 0, cpm: 0 };
    }

    const typedEntries = this._getTypedEntries(session, passage);
    const uncorrectedMistakes = session.mistakes; // Simplification for now

    const rawWpm = typedEntries / 5 / elapsedMinutes;
    const netWpm = Math.max(0, rawWpm - (uncorrectedMistakes / elapsedMinutes));
    
    let totalKeystrokes = session.events.filter(e => e.type === 'CHAR').length;
    let accuracy = 100;
    if (totalKeystrokes > 0) {
      accuracy = Math.max(0, ((totalKeystrokes - session.mistakes) / totalKeystrokes) * 100);
    }

    const cpm = typedEntries / elapsedMinutes;

    return {
      wpm: Math.round(netWpm),
      rawWpm: Math.round(rawWpm),
      accuracy: Math.round(accuracy),
      cpm: Math.round(cpm),
    };
  },

  _getElapsedMinutes(session) {
    if (session.status === SessionStatus.IDLE || !session.startTime) return 0;
    const end = session.status === SessionStatus.COMPLETED ? session.endTime : Date.now();
    return (end - session.startTime) / 60000;
  },

  _getTypedEntries(session, passage) {
    // Total correct chars typed. For simplicity, approximate by current index
    const currentWord = passage.words[session.currentWordIndex];
    if (!currentWord) return passage.totalCharacters; // Completed
    return currentWord.startIndex + session.currentCharIndex;
  }
};
