import React from "react";
import { View, StyleSheet, Animated } from "react-native";

interface IProps {
    width: number;
    height: number;
    boderRadius?: number;
    isCircle?: boolean;
}
const SkeletonLoading = ({ width, height, boderRadius, isCircle }: IProps) => {
    const shimmerAnimated = new Animated.Value(0);

    const shimmerTranslate = shimmerAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [-width, width],
    });

    React.useEffect(() => {
        const shimmerAnimation = Animated.loop(
            Animated.timing(shimmerAnimated, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            })
        );
        shimmerAnimation.start();
        return () => shimmerAnimation.stop();
    }, [shimmerAnimated]);

    return (
        <View
            style={[
                styles.container,
                {
                    borderRadius: isCircle ? 9999 : boderRadius,
                    width,
                    height,
                },
            ]}
        >
            <Animated.View
                style={[
                    styles.shimmer,
                    {
                        transform: [{ translateX: shimmerTranslate }],
                    },
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "gray",
        borderRadius: 8,
        overflow: "hidden",
    },
    shimmer: {
        backgroundColor: "#f2f2f2",
        width: "100%",
        height: "100%",
        position: "absolute",
    },
});

export default SkeletonLoading;
