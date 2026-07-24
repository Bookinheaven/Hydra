import { CharacterStates } from '../constants/CharacterStates.js';
import { ValidationService } from './ValidationService.js';
import { SessionStatus } from '../models/Session.js';

export const TypingService = {
  handleChar(session, passage, char) {
    if (session.status === SessionStatus.COMPLETED) return session;

    const currentWord = passage.words[session.currentWordIndex];
    const expectedChar = currentWord.characters[session.currentCharIndex]?.expected;
    
    const state = ValidationService.validateChar(expectedChar, char);
    
    const newSession = { ...session };
    
    if (session.status === SessionStatus.IDLE) {
      newSession.status = SessionStatus.TYPING;
      newSession.startTime = Date.now();
    }

    if (state === CharacterStates.EXTRA) {
      const extraArr = newSession.extraCharacters[session.currentWordIndex] || [];
      newSession.extraCharacters = {
        ...newSession.extraCharacters,
        [session.currentWordIndex]: [...extraArr, char],
      };
      newSession.currentCharIndex++;
    } else {
      const globalIndex = currentWord.startIndex + session.currentCharIndex;
      newSession.characterStates = {
        ...newSession.characterStates,
        [globalIndex]: state,
      };
      if (state === CharacterStates.INCORRECT) {
        newSession.mistakes++;
      }
      newSession.currentCharIndex++;
    }

    return newSession;
  },

  handleSpace(session, passage) {
    if (session.status === SessionStatus.COMPLETED) return session;

    const currentWord = passage.words[session.currentWordIndex];
    
    // Mark remaining chars as skipped
    const newCharacterStates = { ...session.characterStates };
    for (let i = session.currentCharIndex; i < currentWord.characters.length; i++) {
      const globalIndex = currentWord.startIndex + i;
      newCharacterStates[globalIndex] = CharacterStates.SKIPPED;
    }

    const newSession = {
      ...session,
      characterStates: newCharacterStates,
    };

    if (session.currentWordIndex < passage.words.length - 1) {
      newSession.currentWordIndex++;
      newSession.currentCharIndex = 0;
    } else {
      newSession.status = SessionStatus.COMPLETED;
      newSession.endTime = Date.now();
    }

    return newSession;
  },

  handleBackspace(session, passage) {
    if (session.status === SessionStatus.IDLE) return session;
    if (session.status === SessionStatus.COMPLETED) return session;

    const newSession = { ...session };

    if (session.currentCharIndex > 0) {
      const currentWord = passage.words[session.currentWordIndex];
      newSession.currentCharIndex--;

      if (session.currentCharIndex >= currentWord.characters.length) {
        // Removing an extra character
        const extraArr = [...(newSession.extraCharacters[session.currentWordIndex] || [])];
        extraArr.pop();
        newSession.extraCharacters = {
          ...newSession.extraCharacters,
          [session.currentWordIndex]: extraArr,
        };
      } else {
        // Removing a normal character
        const globalIndex = currentWord.startIndex + session.currentCharIndex;
        const newStates = { ...newSession.characterStates };
        delete newStates[globalIndex];
        newSession.characterStates = newStates;
      }
    } else if (session.currentWordIndex > 0) {
      // Cross-word backspace
      newSession.currentWordIndex--;
      const prevWord = passage.words[newSession.currentWordIndex];
      const extraCount = (newSession.extraCharacters[newSession.currentWordIndex] || []).length;
      newSession.currentCharIndex = prevWord.characters.length + extraCount;
    }

    return newSession;
  }
};