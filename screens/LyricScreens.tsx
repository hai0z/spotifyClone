import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    Animated,
} from "react-native";
import React, { useEffect } from "react";
import { route } from "../types/RootStackParamList";

import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import PlayControl from "../components/MusicPlayer/Control/PlayControl";
import MusicSlider from "../components/MusicPlayer/Control/MusicSlider";
import { Line } from "../types/song";

import useSound from "../hooks/useSound";
import { FlashList } from "@shopify/flash-list";
import { useSongContext } from "../context/SongProvider";

const { width: SCREEN_WIDTH, height } = Dimensions.get("screen");

const LyricScreens: React.FC<{ route: route<"Lyric"> }> = ({ route }) => {
    const { song } = route.params;

    const { joeColor, lyrics, currentLine, getCurrentLyricLine } =
        useSongContext();

    const navigation = useNavigation();

    const topAnimation = React.useRef(new Animated.Value(-100)).current;

    const opacity = topAnimation.interpolate({
        inputRange: [-100, -50, 0],
        outputRange: [0, 0.3, 1],
    });

    const { playFromPosition } = useSound();

    useEffect(() => {
        lyricsRef.current?.scrollToIndex({
            index: currentLine as number,
            animated: true,
            viewOffset: height * 0.3,
        });
    }, [currentLine]);
    React.useLayoutEffect(() => {
        Animated.timing(topAnimation, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
            delay: 300,
        }).start();
    }, []);

    const lyricsRef = React.useRef<FlashList<Line>>(null);

    return (
        <View
            className="flex-1 pt-[35px] "
            style={{ backgroundColor: joeColor?.colors?.dominant?.hex }}
        >
            <Animated.View
                className="px-8 h-24 flex-row relative w-full"
                style={{ transform: [{ translateY: topAnimation }], opacity }}
            >
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
                        {song.artists[0].name}
                    </Text>
                </View>
            </Animated.View>
            <View className="flex-1">
                <FlashList
                    ref={lyricsRef}
                    estimatedItemSize={64}
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled
                    keyExtractor={(item, index) =>
                        `${item.startTimeMs}-${index}`
                    }
                    extraData={currentLine}
                    data={lyrics.lines}
                    initialScrollIndex={currentLine}
                    renderItem={({
                        item,
                        index,
                    }: {
                        item: Line;
                        index: number;
                    }) => {
                        return (
                            <TouchableOpacity
                                onPress={() => {
                                    playFromPosition(+item.startTimeMs);
                                }}
                            >
                                <Text
                                    style={{
                                        color:
                                            (getCurrentLyricLine as number) >=
                                            index
                                                ? "white"
                                                : "black",
                                    }}
                                    className="text-[24px] font-bold px-8 "
                                >
                                    {item.words}
                                </Text>
                            </TouchableOpacity>
                        );
                    }}
                />

                <View className="flex py-8 w-full items-center">
                    <MusicSlider />
                    <PlayControl />
                </View>
            </View>
        </View>
    );
};

export default LyricScreens;
