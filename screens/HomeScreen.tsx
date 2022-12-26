import { StatusBar } from "expo-status-bar";
import {
    Text,
    View,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Dimensions,
} from "react-native";
import axios, { AxiosResponse } from "axios";
import React, { useState, useLayoutEffect } from "react";
import PlayListCard from "../components/PlayListCard";
import Header from "../components/Header";
import { navigation } from "../types/RootStackParamList";

const options = {
    method: "GET",
    url: "https://shazam-core.p.rapidapi.com/v1/charts/world",
    headers: {
        "X-RapidAPI-Key": "25afd00c31msh690f22c6a3516c0p1799adjsn0eade0e56e0b",
        "X-RapidAPI-Host": "shazam-core.p.rapidapi.com",
    },
};
const options2 = {
    method: "GET",
    url: "https://shazam-core.p.rapidapi.com/v1/tracks/related",
    params: { track_id: "554591360" },
    headers: {
        "X-RapidAPI-Key": "25afd00c31msh690f22c6a3516c0p1799adjsn0eade0e56e0b",
        "X-RapidAPI-Host": "shazam-core.p.rapidapi.com",
    },
};

export default function App({
    navigation,
}: {
    navigation: navigation<"HomeTab">;
}) {
    const [playList, setPlayList] = useState([] as any);
    const [track, setTrack] = useState([] as any);
    const [loading, setLoading] = useState<boolean>(true);

    useLayoutEffect(() => {
        setLoading(true);
        axios
            .request(options)
            .then(function (response: AxiosResponse) {
                setPlayList(response.data.slice(0, 10));
                setLoading(false);
            })
            .catch(function (error: any) {
                console.error(error);
            });
        axios
            .request(options2)
            .then(function (response: any) {
                setTrack(response.data.slice(0, 10));
                setLoading(false);
            })
            .catch(function (error: any) {
                console.error(error);
            });
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView>
                <StatusBar style="light" backgroundColor="#0000005d" />
                <Header />
                {loading ? (
                    <View
                        style={{
                            height: Dimensions.get("screen").height / 1.3,
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <ActivityIndicator size="large" />
                    </View>
                ) : (
                    <>
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
                                contentContainerStyle={{ marginVertical: 10 }}
                            >
                                {playList?.map((pl: any, index: number) => {
                                    return (
                                        <PlayListCard
                                            playList={pl}
                                            key={index}
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
                                contentContainerStyle={{ marginVertical: 10 }}
                            >
                                {track?.map((pl: any, index: number) => {
                                    return (
                                        <PlayListCard
                                            playList={pl}
                                            type="artist"
                                            key={index}
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
                                contentContainerStyle={{ marginVertical: 10 }}
                            >
                                {playList?.map((pl: any, index: number) => {
                                    return (
                                        <PlayListCard
                                            playList={pl}
                                            key={index}
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
                                contentContainerStyle={{ marginVertical: 10 }}
                            >
                                {playList?.map((pl: any, index: number) => {
                                    return (
                                        <PlayListCard
                                            playList={pl}
                                            key={index}
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
                                contentContainerStyle={{ marginVertical: 10 }}
                            >
                                {playList?.map((pl: any, index: number) => {
                                    return (
                                        <PlayListCard
                                            playList={pl}
                                            key={index}
                                        />
                                    );
                                })}
                            </ScrollView>
                        </View>
                    </>
                )}
            </ScrollView>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        paddingTop: 50,
        backgroundColor: "#121212",
        flex: 1,
    },
});
