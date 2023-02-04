import React, { useState, useRef, useEffect } from "react";
import { View, Animated, Easing } from "react-native";

const MusicWaves = () => {
    const [animationValue] = useState(new Animated.Value(0));

    const animate = () => {
        Animated.timing(animationValue, {
            toValue: 1,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: false,
        }).start(() => {
            animationValue.setValue(0);
            animate();
        });
    };

    useEffect(() => {
        animate();
    }, []);

    const width = animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["0%", "100%"],
    });

    return (
        <View style={{ flexDirection: "row" }}>
            <Animated.View
                style={{
                    backgroundColor: "red",
                    height: 20,
                    width,
                    transform: [{ translateX: animationValue }],
                }}
            />
        </View>
    );
};

export default MusicWaves;
