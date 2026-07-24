import { KEY_CODES } from "../constants/keyCodes";

const wordService = {

    isWordFinished(passage, session) {

        const word =
            passage.words[session.currentWordIndex];

        if (!word)
            return false;

        return (
            session.currentCharacterIndex >=
            word.characters.length
        );
    },

    shouldMoveToNextWord(
        passage,
        session,
        key
    ) {

        if (key !== KEY_CODES.SPACE)
            return false;

        return this.isWordFinished(
            passage,
            session
        );
    },

};

export default wordService;