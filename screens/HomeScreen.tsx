import { StatusBar } from "expo-status-bar";
import {
    Text,
    View,
    StyleSheet,
    ScrollView,
    RefreshControl,
} from "react-native";
import React, { useState, useLayoutEffect } from "react";
import PlayListCard from "../components/PlayListCard";
import Header from "../components/Header";
import { navigation } from "../types/RootStackParamList";
import { db } from "../firebase";
import MiniPlayCard from "../components/MiniPlayCard";
import { Song } from "../types/song";
import usePlayerAnimation from "../hooks/usePlayerAnimation";

export default function App({
    navigation,
}: {
    navigation: navigation<"HomeTab">;
}) {
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
            style={styles.container}
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
                    style={{
                        marginVertical: 10,
                        flexWrap: "wrap",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginHorizontal: 10,
                    }}
                >
                    {playHistory.map((song, index) => (
                        <MiniPlayCard
                            key={index}
                            song={song}
                            displayAnimation={displayAnimation}
                        />
                    ))}
                </View>
                <View style={{ marginVertical: 10 }}>
                    <Text
                        style={{
                            color: "#fff",
                            fontWeight: "bold",
                            fontSize: 22,
                            marginLeft: 15,
                        }}
                    >
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
                    <Text
                        style={{
                            color: "#fff",
                            fontWeight: "bold",
                            fontSize: 22,
                            marginLeft: 15,
                        }}
                    >
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

                <View style={{ marginVertical: 10 }}>
                    <Text
                        style={{
                            color: "#fff",
                            fontWeight: "bold",
                            fontSize: 22,
                            marginLeft: 15,
                        }}
                    >
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
                <View style={{ marginVertical: 10 }}>
                    <Text
                        style={{
                            color: "#fff",
                            fontWeight: "bold",
                            fontSize: 22,
                            marginLeft: 15,
                        }}
                    >
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
const styles = StyleSheet.create({
    container: {
        backgroundColor: "#121212",
        flex: 1,
        paddingTop: 80,
    },
});
