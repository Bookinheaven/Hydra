export const SessionStatus = Object.freeze({
  IDLE: 'IDLE',
  TYPING: 'TYPING',
  COMPLETED: 'COMPLETED',
});

export const createInitialSession = () => ({
  status: SessionStatus.IDLE,
  startTime: null,
  endTime: null,
  currentWordIndex: 0,
  currentCharIndex: 0,
  mistakes: 0,
  characterStates: {}, // Map of globalIndex -> CharacterState
  extraCharacters: {}, // Map of wordIndex -> Array of extra characters
  events: [], // Typing history
});
