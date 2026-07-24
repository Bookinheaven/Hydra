import React, { memo } from 'react';
import { CharacterStates } from '../constants/CharacterStates.js';

export const Character = memo(function Character({ id, char, state }) {
  let colorClass = 'text-zinc-500'; 
  
  if (state === CharacterStates.CORRECT) colorClass = 'text-zinc-200';
  else if (state === CharacterStates.INCORRECT) colorClass = 'text-red-500 bg-red-500/20 rounded-sm';
  else if (state === CharacterStates.SKIPPED) colorClass = 'text-zinc-700 opacity-50';
  else if (state === CharacterStates.EXTRA) colorClass = 'text-red-400 bg-red-900/30 rounded-sm';

  return (
    <span id={id} className={`inline-block transition-colors duration-100 ${colorClass}`}>
      {char}
    </span>
  );
});