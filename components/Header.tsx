import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
const Header = () => {
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
                Chào buổi sáng
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

const styles = StyleSheet.create({});
