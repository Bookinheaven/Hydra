import { useReducer, useEffect, useCallback, useMemo } from 'react';
import { engineReducer, EngineActionTypes } from '../reducer/engineReducer.js';
import { createInitialSession } from '../models/Session.js';
import { Passage } from '../models/Passage.js';

export function useEngine(initialText) {
  const [session, dispatch] = useReducer(engineReducer, null, createInitialSession);
  
  const passage = useMemo(() => new Passage(initialText), [initialText]);

  const handleKeyDown = useCallback((e) => {
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
  }, [passage]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const reset = useCallback(() => {
    dispatch({ type: EngineActionTypes.RESET });
  }, []);

  return {
    session,
    passage,
    reset,
  };
}
