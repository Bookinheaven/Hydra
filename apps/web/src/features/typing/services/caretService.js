const caretService = {

    isCaretPosition(
        session,
        wordIndex,
        characterIndex
    ) {

        return (
            session.currentWordIndex === wordIndex &&
            session.currentCharacterIndex === characterIndex
        );

    },

};

export default caretService;