import Word from "./Word";

const WordList = ({ passage, session }) => {

    return (
        <div>

            {passage.words.map((word) => (

                <Word
                    key={word.id}
                    word={word}
                    session={session}
                />

            ))}

        </div>
    );
};

export default WordList;