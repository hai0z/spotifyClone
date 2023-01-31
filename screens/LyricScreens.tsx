import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import React from "react";
import { route } from "../types/RootStackParamList";
import { FlashList } from "@shopify/flash-list";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Slider from "@react-native-community/slider";
import PlayControl from "../components/MusicPlayer/Control/PlayControl";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import useSound from "../hooks/useSound";
import caculateTime from "../utils/caculateMusicTime";

const { width: SCREEN_WIDTH } = Dimensions.get("screen");
const LyricScreens = ({ route }: { route: route<"Lyric"> }) => {
    const { song, bgColor } = route.params;
    const navigation = useNavigation();

    const musicState = useSelector((state: RootState) => state.song.musicState);
    const { playFromPosition } = useSound();

    const { currentMin, currentSecond, totalTime } = caculateTime(
        musicState.duration,
        musicState.position
    );
    return (
        <View
            className="flex-1 pt-[35px] "
            style={{ backgroundColor: `#${bgColor}90` }}
        >
            <View className="px-4 h-24 flex-row">
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
                showsVerticalScrollIndicator
                nestedScrollEnabled
                data={song.sections?.[1].text}
                renderItem={({ item }: { item: string }) => (
                    <Text className="text-gray-800 text-[24px] font-semibold px-4">
                        {item}
                    </Text>
                )}
            />
            <View className="flex py-8 w-full items-center">
                <Slider
                    style={{ width: "100%" }}
                    minimumValue={0}
                    maximumValue={100}
                    thumbTintColor="#ffffff"
                    minimumTrackTintColor="#ffffff"
                    maximumTrackTintColor="rgba(255,255,255,0.5)"
                    onSlidingComplete={(value) => {
                        playFromPosition((musicState.duration * value) / 100);
                    }}
                    value={
                        (musicState.position / musicState.duration) * 100 || 0
                    }
                />
                <View className="flex flex-row justify-between w-full px-4">
                    <Text className="text-white font-semibold">
                        {currentMin}:{currentSecond}
                    </Text>
                    <Text className="text-white font-semibold">
                        {totalTime}
                    </Text>
                </View>
                <PlayControl />
            </View>
        </View>
    );
};

export default LyricScreens;
