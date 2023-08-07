import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    Animated,
} from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { route } from "../types/RootStackParamList";

import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import PlayControl from "../components/MusicPlayer/Control/PlayControl";
import MusicSlider from "../components/MusicPlayer/Control/MusicSlider";
import { Line } from "../types/song";

import useSound from "../hooks/useSound";
import { FlashList } from "@shopify/flash-list";
import useSyncLyric from "../hooks/useSyncLyric";

const { width: SCREEN_WIDTH } = Dimensions.get("screen");

const LyricScreens: React.FC<{ route: route<"Lyric"> }> = ({ route }) => {
    const { song, previousLine } = route.params;

    const navigation = useNavigation();

    const topAnimation = React.useRef(new Animated.Value(-100)).current;

    const { currentLine, getCurrentLyricLine } = useSyncLyric(song);

    const opacity = topAnimation.interpolate({
        inputRange: [-100, -50, 0],
        outputRange: [0, 0.3, 1],
    });

    const { playFromPosition } = useSound();

    useEffect(() => {
        lyricsRef.current?.scrollToIndex({
            index: 10,
            animated: true,
        });
        console.log("lakak");
    }, []);

    useEffect(() => {
        lyricsRef.current?.scrollToIndex({
            index: currentLine,
            animated: true,
        });
    }, [currentLine]);

    React.useEffect(() => {
        Animated.timing(topAnimation, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
            delay: 300,
        }).start();
    }, []);

    const lyricsRef = useRef<any>(null);

    return (
        <View
            className="flex-1 pt-[35px] "
            style={{ backgroundColor: `#121212` }}
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
                    estimatedItemSize={90}
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled
                    keyExtractor={(item, index) =>
                        `${item.startTimeMs}-${index}`
                    }
                    extraData={currentLine}
                    data={song?.lyrics?.lines}
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
                                            getCurrentLyricLine! >= index
                                                ? "yellow"
                                                : "white",
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
