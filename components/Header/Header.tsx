import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { navigation } from "../../types/RootStackParamList";
import { useNavigation } from "@react-navigation/native";

interface IHeaderProps {
    navigation?: navigation<"HomeTab">;
}

const Header: React.FC<IHeaderProps> = () => {
    console.log("heder-rerneder");

    const navigation = useNavigation<navigation<"HomeTab">>();

    const timeNow = new Date().getHours();
    const greeting =
        timeNow >= 5 && timeNow < 12
            ? "Chào buổi sáng"
            : timeNow >= 12 && timeNow < 17
            ? "Chào buổi chiều"
            : "Chào buổi tối";

    const handleClick = () => {
        navigation?.navigate("History");
    };
    return (
        <View className="flex-row justify-between items-center pt-20">
            <Text className="text-white font-bold text-[22px] ml-[15px]">
                {greeting}
            </Text>
            <View className="ml-auto flex-row justify-around w-[150px]">
                <FontAwesome5 name="bell" size={24} color="#fff" />
                <TouchableOpacity onPress={handleClick}>
                    <FontAwesome5 name="clock" size={24} color="#fff" />
                </TouchableOpacity>
                <Feather name="settings" size={24} color="#fff" />
            </View>
        </View>
    );
};

export default React.memo(Header);
