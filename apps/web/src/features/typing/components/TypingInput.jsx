import { useEffect, useRef } from "react";

import { TYPING_ACTIONS } from "../reducer/typingActions";
import inputService from "../services/inputService";

const TypingInput = ({ dispatch }) => {

    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleKeyDown = (event) => {

        if (inputService.shouldIgnore(event))
            return;

        event.preventDefault();

        dispatch({
            type: TYPING_ACTIONS.TYPE_KEY,
            payload: event.key,
        });

    };

    return (
        <input
            ref={inputRef}
            autoFocus
            onKeyDown={handleKeyDown}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            style={{
                position: "absolute",
                opacity: 0,
                pointerEvents: "none",
            }}
        />
    );
};

export default TypingInput;