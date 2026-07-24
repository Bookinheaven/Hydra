import { CHARACTER_STATUS } from "../constants/characterStatus";

const skipService = {

    markSkippedCharacters(passage, session) {

        const word =
            passage.words[session.currentWordIndex];

        if (!word) {
            return [];
        }

        const skipped = [];

        for (
            let index = session.currentCharacterIndex;
            index < word.characters.length;
            index++
        ) {

            skipped.push({
                wordIndex: session.currentWordIndex,
                characterIndex: index,
                expected: word.characters[index].value,
                typed: null,
                status: CHARACTER_STATUS.SKIPPED,
                correct: false,
            });

        }

        return skipped;
    },

};

export default skipService;