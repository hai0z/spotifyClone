import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import React from "react";
import { route } from "../types/RootStackParamList";
import { FlashList } from "@shopify/flash-list";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import PlayControl from "../components/MusicPlayer/Control/PlayControl";
import MusicSlider from "../components/MusicPlayer/Control/MusicSlider";
const { width: SCREEN_WIDTH } = Dimensions.get("screen");

const LyricScreens: React.FC<{ route: route<"Lyric"> }> = ({ route }) => {
    const { song, bgColor } = route.params;

    const navigation = useNavigation();

    return (
        <View
            className="flex-1 pt-[35px] "
            style={{ backgroundColor: `#${bgColor}` }}
        >
            <View className="px-8 h-24 flex-row relative w-full">
                <TouchableOpacity
                    className="justify-center items-center"
                    onPress={() => navigation.goBack()}
                    hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
                >
                    <AntDesign name="down" size={24} color="#fff" />
                </TouchableOpacity>
                <View
                    className="flex-col justify-center items-center "
                    style={{
                        transform: [{ translateX: SCREEN_WIDTH * 0.2 }],
                    }}
                >
                    <Text className="text-white shadow-md font-bold">
                        {song.title}
                    </Text>
                    <Text className="text-white shadow-sm opacity-60">
                        {song.subtitle}
                    </Text>
                </View>
            </View>
            <FlashList
                estimatedItemSize={30}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled
                data={song.sections?.[1].text}
                renderItem={({ item }: { item: string }) => (
                    <Text className="text-white text-[24px] font-semibold px-8">
                        {item}
                    </Text>
                )}
            />
            <View className="flex py-8 w-full items-center">
                <MusicSlider />
                <PlayControl />
            </View>
        </View>
    );
};

export default LyricScreens;
