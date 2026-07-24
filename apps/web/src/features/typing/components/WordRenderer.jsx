const WordRenderer = ({ words }) => {
    return (
        <div>
            {words.map((word) => (
                <span
                    key={word.id}
                    style={{ marginRight: "8px" }}
                >
                    {word.text}
                </span>
            ))}
        </div>
    );
};

export default WordRenderer;