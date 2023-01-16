import React, { useRef, createContext, ReactNode } from "react";
import { Animated } from "react-native";

interface IAnimationContext {
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
    const playerAnimation = useRef(new Animated.Value(50)).current;

    const displayAnimation = () => {
        Animated.timing(playerAnimation, {
            toValue: 35,
            duration: 150,
            useNativeDriver: false,
        }).start(() => displayAnimation2());
    };
    const displayAnimation2 = () => {
        Animated.timing(playerAnimation, {
            toValue: 50,
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
