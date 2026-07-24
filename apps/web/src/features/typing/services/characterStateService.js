import { CHARACTER_STATUS } from "../constants/characterStatus";
import characterKeyService from "./characterKeyService";

const characterStateService = {

    getCharacterState(session, wordIndex, characterIndex) {

        const key =
            characterKeyService.create(
                wordIndex,
                characterIndex
            );

        return (
            session.characterStates[key]?.status ??
            CHARACTER_STATUS.UNTYPED
        );

    }

};

export default characterStateService;