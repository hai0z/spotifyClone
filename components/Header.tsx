import { Text, View } from "react-native";
import React from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
const Header = () => {
    console.log("heder-rerneder");
    const timeNow = new Date().getHours();
    const greeting =
        timeNow >= 5 && timeNow < 12
            ? "Chào buổi sáng"
            : timeNow >= 12 && timeNow < 18
            ? "Chào buổi chiều"
            : "Chào buổi tối";

    return (
        <View className="flex-row justify-between items-center">
            <Text className="text-white font-bold text-[22px] ml-[15px]">
                {greeting}
            </Text>
            <View className="ml-auto flex-row justify-around w-[150px]">
                <FontAwesome5 name="bell" size={24} color="#fff" />
                <FontAwesome5 name="clock" size={24} color="#fff" />
                <Feather name="settings" size={24} color="#fff" />
            </View>
        </View>
    );
};

export default React.memo(Header);
