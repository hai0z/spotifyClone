import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Animated } from "react-native";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useSongContext } from "../context/SongProvider";
import { LinearGradient } from "expo-linear-gradient";

const options = {
    method: "GET",
    url: "https://shazam-core.p.rapidapi.com/v1/artists/details",
    params: { artist_id: "560664277" },
    headers: {
        "X-RapidAPI-Key": "25afd00c31msh690f22c6a3516c0p1799adjsn0eade0e56e0b",
        "X-RapidAPI-Host": "shazam-core.p.rapidapi.com",
    },
};
const getKey = (obj: any) => {
    const c = [];
    for (const key in obj) {
        c.push({
            item: {
                title: obj[key].attributes.albumName,
                image: obj[key].attributes.artwork.url,
                subTitle: obj[key].attributes.artistName,
            },
            uri: obj[key].attributes.previews?.[0].url,
        });
    }
    return c;
};
const AlbumAndArtist = () => {
    const [activeSong, setActiveSong] = React.useState("");
    const [data, setData] = React.useState([] as any);
    React.useEffect(() => {
        axios
            .request(options)
            .then(function (response: AxiosResponse) {
                setData(response.data);
                console.log(response.data);
            })
            .catch(function (error: AxiosError) {
                console.error(error.message);
            });
    }, []);
    const scrollY = React.useRef(new Animated.Value(0)).current;
    const songAnimated = React.useRef(new Animated.Value(1)).current;
    const { setCurrentSong } = useSongContext();

    const inputRange = [-150, 0, 120, 140];
    const scale = scrollY.interpolate({
        inputRange,
        outputRange: [1, 1, 0.5, 0],
        extrapolate: "clamp",
    });
    const opacity = scrollY.interpolate({
        inputRange: [-150, 0, 100, 120],
        outputRange: [0, 1, 0.5, 0],
        extrapolate: "clamp",
    });

    const songScale = () => {
        Animated.spring(songAnimated, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };
    return (
        <LinearGradient
            colors={["peru", "#282828", "#121212"]}
            start={{ x: 0.4, y: 0.1 }}
            end={{ x: 0.6, y: 0.75 }}
            style={{
                flex: 1,
                justifyContent: "center",
                paddingLeft: 15,
            }}
        >
            <Animated.ScrollView
                contentContainerStyle={{ paddingTop: 50 }}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    {
                        useNativeDriver: true,
                    }
                )}
            >
                <Animated.View
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        transform: [{ scale }],
                    }}
                >
                    <Animated.Image
                        source={{
                            uri: "https://is4-ssl.mzstatic.com/image/thumb/Music112/v4/6a/94/91/6a9491c3-01b6-bcc5-28e0-fca6ba6764fd/cover.jpg/440x440ac.jpg",
                        }}
                        style={{
                            width: 300,
                            height: 300,
                            resizeMode: "cover",
                            marginBottom: 20,
                            opacity,
                        }}
                    />
                </Animated.View>
                <Animated.View>
                    <Text style={{ color: "#fff" }}>Tuyển tập Hùng Quân</Text>
                </Animated.View>
                {getKey(data?.songs).map((x) => (
                    <TouchableOpacity
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            padding: 5,
                        }}
                        key={x.uri}
                        onPress={() => {
                            songScale();
                            setCurrentSong({
                                title: x.item.title,
                                subtitle: x.item.subTitle,
                                images: {
                                    coverart: x.item.image,
                                },
                                hub: {
                                    actions: [1, { uri: x.uri }],
                                },
                            });
                            setActiveSong(x.uri);
                        }}
                    >
                        <Image
                            source={{ uri: x.item.image }}
                            style={{
                                width: 50,
                                height: 50,
                                resizeMode: "cover",
                            }}
                        />
                        <View
                            style={{
                                justifyContent: "center",
                                marginLeft: 10,
                                maxWidth: "80%",
                            }}
                        >
                            {activeSong === x.uri ? (
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "flex-end",
                                        marginRight: 2,
                                        backgroundColor: "red",
                                    }}
                                >
                                    <View
                                        style={{
                                            width: 3,
                                            height: 3,
                                            backgroundColor: "#13d670",
                                            marginRight: 2,
                                        }}
                                    />
                                    <View
                                        style={{
                                            width: 3,
                                            height: 3,
                                            backgroundColor: "#13d670",
                                            marginRight: 2,
                                        }}
                                    />
                                    <View
                                        style={{
                                            width: 3,
                                            height: 3,
                                            backgroundColor: "#13d670",
                                        }}
                                    />
                                    <Text
                                        style={{ color: "#1ed760" }}
                                        numberOfLines={1}
                                    >
                                        {x.item.title}
                                    </Text>
                                </View>
                            ) : (
                                <Text
                                    style={{ color: "#fff" }}
                                    numberOfLines={1}
                                >
                                    {x.item.title}
                                </Text>
                            )}

                            <Text style={{ color: "#fff" }}>
                                {x.item.subTitle}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </Animated.ScrollView>
        </LinearGradient>
    );
};

export default AlbumAndArtist;
