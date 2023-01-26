import { ViewStyle, StyleProp } from "react-native";

export const tabBarStyle: StyleProp<ViewStyle> = {
    position: "absolute",
    borderTopWidth: 0,
    bottom: 0,
    right: 0,
    height: 70,
    width: "100%",
    zIndex: 2,
    backgroundColor: "#00000075",
    opacity: 0.9,
};

export const tabBarIconStyle: StyleProp<ViewStyle> = {
    backgroundColor: "#00000075",
    position: "relative",
};
