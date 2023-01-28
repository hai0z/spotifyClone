import { ViewStyle, StyleProp } from "react-native";

export const tabBarStyle: StyleProp<ViewStyle> = {
    position: "absolute",
    borderTopWidth: 0,
    bottom: 0,
    right: 0,
    height: 65,
    width: "100%",
    zIndex: 2,
    backgroundColor: "#00000050",
    opacity: 0.95,
};

export const tabBarItemStyle: StyleProp<ViewStyle> = {
    backgroundColor: "#00000050",
    position: "relative",
};
