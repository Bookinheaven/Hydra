import React, { memo } from 'react';
import { Character } from './Character.jsx';
import { CharacterStates } from '../constants/CharacterStates.js';

export const Word = memo(function Word({ word, characterStates, extraChars, isCurrent, currentCharIndex }) {
  return (
    <div className="word-wrapper inline-block whitespace-nowrap mb-1.5 mr-3 text-2xl font-mono tracking-normal leading-[48px]">
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
  
  for (let i = prev.word.startIndex; i <= prev.word.endIndex; i++) {
    if (prev.characterStates[i] !== next.characterStates[i]) {
      return false;
    }
  }
  return true;
});