import { CharacterStates } from '../constants/CharacterStates.js';

export const ValidationService = {
  validateChar(expectedChar, typedChar) {
    if (!expectedChar) return CharacterStates.EXTRA;
    return expectedChar === typedChar ? CharacterStates.CORRECT : CharacterStates.INCORRECT;
  }
};