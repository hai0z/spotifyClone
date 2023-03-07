import { StatusBar } from "expo-status-bar";
import {
    Text,
    View,
    ScrollView,
    RefreshControl,
    ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import PlayListCard from "../components/MusicCard/PlayListCard";
import Header from "../components/Header/Header";
import { navigation } from "../types/RootStackParamList";
import MiniPlayCard from "../components/MusicCard/MiniPlayCard";
import { Song } from "../types/song";
import usePlayerAnimation from "../hooks/usePlayerAnimation";
import { LinearGradient } from "expo-linear-gradient";
import { getPlayHistory, getSong } from "../services/firebaseService";
import useHeaderColor from "../hooks/useHeaderColor";
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
        setRefreshing(false);
    }, []);

    const getData = async () => {
        const data = await getSong();
        setTrack(data.sort(() => 0.5 - Math.random()).slice(0, 10));
        setPlayList(data.sort(() => 0.5 - Math.random()));
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

    const headerColor = useHeaderColor();

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
                        colors={[headerColor, "#121212"]}
                        start={{ x: 0.4, y: 0.1 }}
                        end={{ x: 0.5, y: 0.75 }}
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
                        {/* <MusicWaves /> */}
                        <Text className="text-white font-bold text-[22px] ml-[15px] mb-[10px]">
                            Đề xuất cho bạn
                        </Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ marginVertical: 10 }}
                        >
                            {playList
                                .slice(0, 10)
                                ?.map((pl: Song, index: number) => {
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
                            {track?.map((pl: Song, index: number) => {
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
                            {playList
                                .slice(10, 20)
                                ?.map((pl: Song, index: number) => {
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
                            {playList
                                .slice(20, 30)
                                ?.map((pl: Song, index: number) => {
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
