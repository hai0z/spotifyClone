import { StatusBar } from "expo-status-bar";
import {
    Text,
    View,
    ScrollView,
    RefreshControl,
    ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import PlayListCard from "../components/PlayListCard";
import Header from "../components/Header";
import { navigation } from "../types/RootStackParamList";
import { db } from "../firebase";
import MiniPlayCard from "../components/MiniPlayCard";
import { Song } from "../types/song";
import usePlayerAnimation from "../hooks/usePlayerAnimation";
import { LinearGradient } from "expo-linear-gradient";
import getPlayHistory from "../services/getPlayHistory";
import getSong from "../services/getSong";
enum COLOR {
    WHITE = "#3cb37160",
    CORAL = "#ff7f5080",
    INDIGO = "#33009970",
}

interface IHomeProps {
    navigation: navigation<"HomeTab">;
}
export default function App({ navigation }: IHomeProps) {
    const [playList, setPlayList] = useState<Song[]>([]);

    const [track, setTrack] = useState<Song[]>([]);

    const [playHistory, setPlayHistory] = useState<Song[]>([]);

    const [refreshing, setRefreshing] = React.useState(false);

    const [loading, setLoading] = React.useState(true);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getData();
        getHistory();
        setRefreshing(false);
    }, []);

    const getData = async () => {
        const data = await getSong();
        setTrack(data.sort(() => 0.5 - Math.random()).slice(0, 10));
        setPlayList(data.sort(() => 0.5 - Math.random()).slice(0, 10));
    };

    const getHistory = async () => {
        const data = await getPlayHistory();
        setPlayHistory(data);
        setLoading(false);
    };

    React.useEffect(() => {
        getHistory();
        getData();
    }, []);

    const { displayAnimation } = usePlayerAnimation();

    const timeNow = new Date().getHours();

    const color =
        timeNow >= 5 && timeNow < 12
            ? COLOR.WHITE
            : timeNow >= 12 && timeNow < 17
            ? COLOR.CORAL
            : COLOR.INDIGO;

    if (loading) {
        return (
            <View className="bg-black w-full h-full relative z-20 items-center justify-center">
                <ActivityIndicator size="large" color="mediumseagreen" />
            </View>
        );
    } else
        return (
            <ScrollView
                showsVerticalScrollIndicator={false}
                className="flex-1 bg-[#121212] relative "
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <View className="relative -z-1">
                    <LinearGradient
                        className="w-full h-40"
                        colors={[color, "#121212"]}
                        start={{ x: 0.4, y: 0.1 }}
                        end={{ x: 0.5, y: 0.75 }}
                        style={{ zIndex: -1 }}
                    >
                        <Header />
                    </LinearGradient>
                </View>
                <ScrollView
                    className="z-10 -mt-12"
                    contentContainerStyle={{
                        paddingBottom: 170,
                    }}
                >
                    <StatusBar style="light" backgroundColor="#00000050" />
                    <View
                        className="mt-[10px] flex-wrap 
                flex-row justify-between ml-[10px] my-[10px]
                mx-[10px]"
                    >
                        {playHistory.map((song, index) => (
                            <MiniPlayCard
                                key={index}
                                song={song}
                                displayAnimation={displayAnimation}
                            />
                        ))}
                    </View>
                    <View className="mt-8">
                        <Text className="text-white font-bold text-[22px] ml-[15px] mb-[10px]">
                            Thịnh hành
                        </Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ marginVertical: 10 }}
                        >
                            {playList?.map((pl: any, index: number) => {
                                return (
                                    <PlayListCard
                                        playList={pl}
                                        key={index}
                                        displayAnimation={displayAnimation}
                                    />
                                );
                            })}
                        </ScrollView>
                    </View>

                    <View className="my-2">
                        <Text className="text-white font-bold text-[22px] ml-[15px] mb-[10px]">
                            Nghệ sĩ bạn thích
                        </Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ marginVertical: 10 }}
                        >
                            {track?.map((pl: any, index: number) => {
                                return (
                                    <PlayListCard
                                        playList={pl}
                                        type="artist"
                                        key={index}
                                        displayAnimation={displayAnimation}
                                        navigation={navigation}
                                    />
                                );
                            })}
                        </ScrollView>
                    </View>

                    <View className="my-2">
                        <Text className="text-white font-bold text-[22px] ml-[15px] mb-[10px] ">
                            Hãy thử cách khác
                        </Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ marginVertical: 10 }}
                        >
                            {playList?.map((pl: any, index: number) => {
                                return (
                                    <PlayListCard
                                        playList={pl}
                                        key={index}
                                        displayAnimation={displayAnimation}
                                    />
                                );
                            })}
                        </ScrollView>
                    </View>
                    <View className="my-2">
                        <Text className="text-white font-bold text-[22px] ml-[15px] mb-[10px]">
                            Dành cho bạn
                        </Text>
                        <ScrollView
                            showsHorizontalScrollIndicator={false}
                            horizontal
                            contentContainerStyle={{ marginVertical: 10 }}
                        >
                            {playList?.map((pl: any, index: number) => {
                                return (
                                    <PlayListCard
                                        playList={pl}
                                        key={index}
                                        displayAnimation={displayAnimation}
                                    />
                                );
                            })}
                        </ScrollView>
                    </View>
                </ScrollView>
            </ScrollView>
        );
}
