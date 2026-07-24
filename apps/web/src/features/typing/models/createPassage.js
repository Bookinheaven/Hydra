const createPassage = (text) => {
    return {
        text,

        words: text.split(" ").map((word, wordIndex) => ({
            id: wordIndex,

            text: word,

            characters: word.split("").map((character, characterIndex) => ({
                id: characterIndex,
                value: character,
            })),
        })),
    };
};

export default createPassage;