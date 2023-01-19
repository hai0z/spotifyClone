import { StatusBar } from "expo-status-bar";
import { Text, View, ScrollView, RefreshControl } from "react-native";
import React, { useState, useLayoutEffect } from "react";
import PlayListCard from "../components/PlayListCard";
import Header from "../components/Header";
import { navigation } from "../types/RootStackParamList";
import { db } from "../firebase";
import MiniPlayCard from "../components/MiniPlayCard";
import { Song } from "../types/song";
import usePlayerAnimation from "../hooks/usePlayerAnimation";

interface IHomeProps {
    navigation: navigation<"HomeTab">;
}
export default function App({ navigation }: IHomeProps) {
    const [playList, setPlayList] = useState<Song[]>([]);

    const [track, setTrack] = useState<Song[]>([]);

    const [playHistory, setPlayHistory] = useState<Song[]>([]);

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getData();
        getHistory();
        setRefreshing(false);
    }, []);

    const getData = async () => {
        const q = db.query(db.collection(db.getFirestore(), "likedList"));
        const track: Song[] = [];
        const querySnapshot = await db.getDocs(q);
        querySnapshot.forEach((doc) => {
            track.push(doc.data() as Song);
        });
        setTrack(track.sort(() => 0.5 - Math.random()).slice(0, 10));
        setPlayList(track.sort(() => 0.5 - Math.random()).slice(0, 10));
    };

    const getHistory = async () => {
        const song: Song[] = [];
        const q = db.query(
            db.collection(db.getFirestore(), "playHistory"),
            db.orderBy("time", "desc")
        );
        const querySnapshot = await db.getDocs(q);
        querySnapshot.forEach((doc) => {
            song.push(doc.data() as Song);
        });
        setPlayHistory(song.slice(0, 6));
    };

    useLayoutEffect(() => {
        getHistory();
        getData();
    }, []);

    const { displayAnimation } = usePlayerAnimation();

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            className="pt-[80px] flex-1 bg-[#121212] "
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <Header />
            <ScrollView
                contentContainerStyle={{
                    paddingBottom: 170,
                }}
            >
                <StatusBar style="light" />
                <View
                    className="mt-[10px] mb-0-[10px] flex-wrap 
                flex-row justify-between mr-[10xp] ml-[10px] my-[10px]
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
                <View>
                    <Text className="text-white font-bold text-[22px] ml-[15px] my-[10xp]">
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

                <View style={{ marginVertical: 10 }}>
                    <Text className="text-white font-bold text-[22px] ml-[15px]">
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

                <View>
                    <Text className="text-white font-bold text-[22px] ml-[15px] my-[10px]">
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
                <View style={{ marginVertical: 10 }} className="my-[10px]">
                    <Text className="text-white font-bold text-[22px] ml-[15px]">
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
