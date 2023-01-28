import React from "react";
import { AnimationContext } from "../context/AnimationProvider";

const usePlayerAnimation = () => {
    return React.useContext(AnimationContext);
};

export default usePlayerAnimation;
