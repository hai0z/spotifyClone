import React from "react";
import { AnimationContext } from "../context/AnimationProvider";

const usePlayerAnimation = () => {
    const { playerAnimation, displayAnimation } =
        React.useContext(AnimationContext);
    return {
        playerAnimation,
        displayAnimation,
    };
};

export default usePlayerAnimation;
