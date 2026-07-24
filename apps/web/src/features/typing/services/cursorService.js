const cursorService = {
    moveToNextCharacter(session) {
        return {
            ...session,
            currentCharacterIndex: session.currentCharacterIndex + 1,
        };
    },

    moveToNextWord(session) {
        return {
            ...session,
            currentWordIndex: session.currentWordIndex + 1,
            currentCharacterIndex: 0,
        };
    },
};

export default cursorService;