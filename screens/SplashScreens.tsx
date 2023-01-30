import { View, Image, StatusBar } from "react-native";
import React from "react";
import Logo from "../assets/appLogo.png";
import { useNavigation } from "@react-navigation/native";
import { navigation } from "../types/RootStackParamList";

const SplashScreens = () => {
    const navigation = useNavigation<navigation<"Splash">>();
    React.useEffect(() => {
        const s = setTimeout(() => navigation.navigate("HomeTab"), 1000);

        return () => clearTimeout(s);
    }, []);
    return (
        <View className="flex-1 bg-black justify-center items-center">
            <StatusBar backgroundColor="#000000" />
            <Image source={Logo} className="w-[150px] h-[150px]" />
        </View>
    );
};

export default SplashScreens;
