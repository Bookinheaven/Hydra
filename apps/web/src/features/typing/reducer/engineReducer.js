import { InputType, InputService } from '../services/InputService.js';
import { TypingService } from '../services/TypingService.js';
import { createInitialSession, SessionStatus } from '../models/Session.js';

export const EngineActionTypes = {
  KEYDOWN: 'KEYDOWN',
  RESET: 'RESET',
  END_SESSION: 'END_SESSION',
};

export function engineReducer(state, action) {
  if (action.type === EngineActionTypes.RESET) {
    return createInitialSession();
  }

  if (action.type === EngineActionTypes.END_SESSION) {
    if (state.status !== SessionStatus.COMPLETED) {
      return {
        ...state,
        status: SessionStatus.COMPLETED,
        endTime: Date.now(),
      };
    }
    return state;
  }

  if (action.type === EngineActionTypes.KEYDOWN) {
    if (!action.payload) return state;
    const { key, ctrlKey, metaKey, altKey, passage } = action.payload;
    const inputType = InputService.classify(key, ctrlKey, metaKey, altKey);

    let newState = state;

    switch (inputType) {
      case InputType.CHAR:
        newState = TypingService.handleChar(state, passage, key);
        break;
      case InputType.SPACE:
        newState = TypingService.handleSpace(state, passage);
        break;
      case InputType.BACKSPACE:
        newState = TypingService.handleBackspace(state, passage);
        break;
      case InputType.IGNORE:
      default:
        break;
    }

    if (newState !== state && inputType !== InputType.IGNORE) {
      // Record event history (we can expand this later)
      newState = {
        ...newState,
        events: [
          ...newState.events,
          { type: inputType, key, timestamp: Date.now() }
        ]
      };
    }

    return newState;
  }

  return state;
}
