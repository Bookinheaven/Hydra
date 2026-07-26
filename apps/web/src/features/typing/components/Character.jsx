import React, { memo } from 'react';
import { CharacterStates } from '../constants/CharacterStates.js';

export const Character = memo(function Character({ id, char, state }) {
  let colorClass = 'text-[var(--text-color)]'; // untyped — dimmed
  
  if (state === CharacterStates.CORRECT) {
    colorClass = 'text-[var(--sub-color)]';
  } else if (state === CharacterStates.INCORRECT) {
    colorClass = 'text-[var(--error-color)]';
  } else if (state === CharacterStates.SKIPPED) {
    colorClass = 'text-[var(--text-color)] opacity-40';
  } else if (state === CharacterStates.EXTRA) {
    colorClass = 'text-[var(--error-color)] opacity-70';
  }

  return (
    <span id={id} className={`inline transition-colors duration-75 font-mono select-none ${colorClass}`}>
      {char}
    </span>
  );
});