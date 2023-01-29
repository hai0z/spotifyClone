import React, { useRef, createContext, ReactNode } from "react";
import { Animated } from "react-native";

export interface IAnimationContext {
    playerAnimation: Animated.Value;
    displayAnimation: () => void;
}
export const AnimationContext = createContext<IAnimationContext>(
    {} as IAnimationContext
);

interface IAnimationProviderProps {
    children: ReactNode;
}
const AnimationProvider = ({ children }: IAnimationProviderProps) => {
    const playerAnimation = useRef(new Animated.Value(65)).current;

    const displayAnimation = () => {
        Animated.timing(playerAnimation, {
            toValue: 45,
            duration: 150,
            useNativeDriver: false,
        }).start(() => displayAnimation2());
    };
    const displayAnimation2 = () => {
        Animated.timing(playerAnimation, {
            toValue: 65,
            duration: 150,
            useNativeDriver: false,
        }).start();
    };
    return (
        <AnimationContext.Provider
            value={{ playerAnimation, displayAnimation }}
        >
            {children}
        </AnimationContext.Provider>
    );
};
export default AnimationProvider;
