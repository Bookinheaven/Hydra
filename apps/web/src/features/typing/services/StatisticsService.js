import { SessionStatus } from '../models/Session.js';

export const StatisticsService = {
  calculateStats(session, passage) {
    const elapsedMinutes = this._getElapsedMinutes(session);
    if (elapsedMinutes <= 0) {
      return { wpm: 0, rawWpm: 0, accuracy: 100, cpm: 0 };
    }

    const typedEntries = this._getTypedEntries(session, passage);
    const mistakes = session.mistakes || 0;

    // Standard Monkeytype WPM formula: (correct chars + spaces) / 5 / elapsed minutes
    const rawWpm = typedEntries / 5 / elapsedMinutes;
    const correctEntries = Math.max(0, typedEntries - mistakes);
    const netWpm = correctEntries / 5 / elapsedMinutes;
    
    let totalKeystrokes = session.events && session.events.length > 0
      ? session.events.filter(e => e.type === 'CHAR').length 
      : typedEntries;
      
    let accuracy = 100;
    if (totalKeystrokes > 0) {
      accuracy = Math.max(0, ((totalKeystrokes - mistakes) / totalKeystrokes) * 100);
    } else if (typedEntries > 0) {
      accuracy = Math.max(0, ((typedEntries - mistakes) / typedEntries) * 100);
    }

    const cpm = typedEntries / elapsedMinutes;

    return {
      wpm: Math.max(0, Math.round(netWpm)),
      rawWpm: Math.max(0, Math.round(rawWpm)),
      accuracy: Math.min(100, Math.max(0, Math.round(accuracy))),
      cpm: Math.max(0, Math.round(cpm)),
    };
  },

  _getElapsedMinutes(session) {
    if (session.status === SessionStatus.IDLE || !session.startTime) return 0;
    const end = session.status === SessionStatus.COMPLETED && session.endTime ? session.endTime : Date.now();
    const durationMs = Math.max(500, end - session.startTime);
    return durationMs / 60000;
  },

  _getTypedEntries(session, passage) {
    const currentWord = passage.words[session.currentWordIndex];
    if (!currentWord) return passage.totalCharacters;
    return currentWord.startIndex + session.currentCharIndex;
  }
};
