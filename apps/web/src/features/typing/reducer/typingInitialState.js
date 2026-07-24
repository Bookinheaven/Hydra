import { TYPING_STATUS } from "../constants/typingStatus";

export const typingInitialState = (words) => ({
    words,
    typedText: "",
    currentWordIndex: 0,
    currentCharacterIndex: 0,
    status: TYPING_STATUS.IDLE,
});