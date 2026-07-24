import { TYPING_STATUS } from "../constants/typingStatus";

const createSession = () => ({
    status: TYPING_STATUS.IDLE,

    currentWordIndex: 0,

    currentCharacterIndex: 0,

    typedCharacters: [],

    mistakes: 0,

    startedAt: null,

    finishedAt: null,
});

export default createSession;