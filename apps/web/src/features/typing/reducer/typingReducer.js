import { TYPING_ACTIONS } from "./typingActions";
import typingService from "../services/typingService";

export const typingReducer = (state, action) => {

    switch (action.type) {

        case TYPING_ACTIONS.TYPE_KEY:
            return typingService.typeKey(
                state,
                action.payload
            );

        case TYPING_ACTIONS.RESET:
            return typingService.reset(state);

        default:
            return state;
    }
};