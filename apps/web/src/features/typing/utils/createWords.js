import { CHARACTER_STATUS } from "../constants/characterStatus";

const createWords = (text) => {
    return text.split(" ").map((word, wordIndex) => ({
        id: wordIndex,

        characters: word.split("").map((character, characterIndex) => ({
            id: characterIndex,
            value: character,
            status: CHARACTER_STATUS.PENDING,
        })),
    }));
};

export default createWords;