import { PlayerContext } from "./../context/PlayerProvider";
import React from "react";
const usePlayerAnimation = () => {
    const { playerAnimation, displayAnimation, titleAnimation } =
        React.useContext(PlayerContext);
    return {
        playerAnimation,
        titleAnimation,
        displayAnimation,
    };
};

export default usePlayerAnimation;
