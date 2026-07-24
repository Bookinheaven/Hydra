import TypingArea from "./components/TypingArea";
import useTypingEngine from "./hooks/useTypingEngine";

const TypingPage = () => {

    const engine = useTypingEngine();

    return (
        <TypingArea
            state={engine.state}
            dispatch={engine.dispatch}
        />
    );
};

export default TypingPage;