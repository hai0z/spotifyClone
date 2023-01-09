import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
const Header = () => {
    const timeNow = new Date().getHours();
    const greeting =
        timeNow >= 5 && timeNow < 12
            ? "Chào buổi sáng"
            : timeNow >= 12 && timeNow < 18
            ? "Chào buổi chiều"
            : "Chào buổi tối";
    return (
        <View
            style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            <Text
                style={{
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: 22,
                    marginLeft: 15,
                }}
            >
                {greeting}
            </Text>
            <View
                style={{
                    marginLeft: "auto",
                    flexDirection: "row",
                    justifyContent: "space-around",
                    width: 150,
                }}
            >
                <FontAwesome5 name="bell" size={24} color="#fff" />
                <FontAwesome5 name="clock" size={24} color="#fff" />
                <Feather name="settings" size={24} color="#fff" />
            </View>
        </View>
    );
};

export default Header;
