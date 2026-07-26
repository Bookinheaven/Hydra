import { useReducer, useEffect, useCallback, useMemo } from 'react';
import { engineReducer, EngineActionTypes } from '../reducer/engineReducer.js';
import { createInitialSession } from '../models/Session.js';
import { Passage } from '../models/Passage.js';

export function useEngine(initialText, enabled = true) {
  const [session, dispatch] = useReducer(engineReducer, null, createInitialSession);
  
  const passage = useMemo(() => new Passage(initialText), [initialText]);

  const handleKeyDown = useCallback((e) => {
    if (!enabled || !e || typeof e.key !== 'string') return;
    const target = e.target;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable)) {
      return;
    }
    dispatch({
      type: EngineActionTypes.KEYDOWN,
      payload: {
        key: e.key,
        ctrlKey: e.ctrlKey,
        metaKey: e.metaKey,
        altKey: e.altKey,
        passage,
      },
    });
  }, [passage, enabled]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const reset = useCallback(() => {
    dispatch({ type: EngineActionTypes.RESET });
  }, []);

  const endSession = useCallback(() => {
    dispatch({ type: EngineActionTypes.END_SESSION });
  }, []);

  return {
    session,
    passage,
    reset,
    endSession,
  };
}
