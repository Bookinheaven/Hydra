import { useMemo, useReducer } from "react";

import sampleTexts from "../data/sampleTexts";

import createPassage from "../models/createPassage";
import createSession from "../models/createSession";

import { typingReducer } from "../reducer/typingReducer";

const useTypingEngine = () => {

    const passage = useMemo(
        () => createPassage(sampleTexts[0]),
        []
    );

    const initialState = {
        passage,

        session: createSession(),
    };

    const [state, dispatch] = useReducer(
        typingReducer,
        initialState
    );

    return {
        state,
        dispatch,
    };
};

export default useTypingEngine;