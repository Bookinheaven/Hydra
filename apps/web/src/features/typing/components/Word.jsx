import React, { memo } from 'react';
import { Character } from './Character.jsx';
import { CharacterStates } from '../constants/CharacterStates.js';

export const Word = memo(function Word({ word, characterStates, extraChars, isCurrent, currentCharIndex }) {
  // If word is current or has errors, it might need a visual indicator (like underline for error in strict mode), but we'll keep it simple for now.
  
  return (
    <div className="inline-block relative whitespace-nowrap mb-2 mr-3 text-2xl font-mono">
      {word.characters.map((charObj) => {
        const state = characterStates[charObj.globalIndex] || CharacterStates.UNTYPED;
        const id = `char-${word.index}-${charObj.index}`;
        return (
          <Character 
            key={charObj.globalIndex} 
            id={id}
            char={charObj.expected} 
            state={state} 
          />
        );
      })}
      {extraChars && extraChars.map((char, idx) => {
        const id = `char-${word.index}-${word.characters.length + idx}`;
        return (
          <Character 
            key={`extra-${word.index}-${idx}`} 
            id={id}
            char={char} 
            state={CharacterStates.EXTRA} 
          />
        );
      })}
    </div>
  );
}, (prev, next) => {
  if (prev.isCurrent !== next.isCurrent) return false;
  if (prev.currentCharIndex !== next.currentCharIndex) return false;
  if (prev.extraChars !== next.extraChars) return false;
  
  // Shallow compare character states for this word's range. 
  // O(N) where N is word length, still O(1) in the context of the whole passage.
  for (let i = prev.word.startIndex; i <= prev.word.endIndex; i++) {
    if (prev.characterStates[i] !== next.characterStates[i]) {
      return false;
    }
  }
  return true;
});