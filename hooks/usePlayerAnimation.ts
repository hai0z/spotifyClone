import { IAnimationContext } from "./../context/AnimationProvider";
import React from "react";
import { AnimationContext } from "../context/AnimationProvider";

const usePlayerAnimation = (): IAnimationContext => {
    return React.useContext(AnimationContext);
};

export default usePlayerAnimation;
