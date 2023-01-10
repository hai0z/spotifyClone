import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Animated } from "react-native";
import { useSongContext } from "../context/SongProvider";
import { Song } from "../types/song";
import { useDispatch } from "react-redux";
import { setPlaying } from "../redux/songSlice";
import { LinearGradient } from "expo-linear-gradient";

const { width: SCREEN_WITH } = Dimensions.get("screen");
const AlbumAndArtist = () => {
    const dispatch = useDispatch();

    const scrollY = React.useRef(new Animated.Value(0)).current;

    const {
        setCurrentSong,
        currentSong,
        ListFavourite: data,
    } = useSongContext();

    const [searchValue, setSearchValue] = useState("");

    const [searchResult, setSearchResult] = useState(data);

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

    useEffect(() => {
        setSearchResult(data);
    }, [data]);

    const onSearch = (songName: string) => {
        setSearchValue(songName);
        if (songName.trim().length == 0 || songName.trim() == "") {
            setSearchResult(data);
        } else {
            setSearchResult(
                data.filter((song: any) =>
                    song.title.toLowerCase().includes(songName.toLowerCase())
                )
            );
        }
    };
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                backgroundColor: "#121212",
                position: "relative",
            }}
        >
            <LinearGradient
                colors={["midnightblue", "midnightblue"]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={{
                    paddingTop: 50,
                    paddingHorizontal: 15,
                    paddingBottom: 20,
                }}
            >
                <TextInput
                    placeholder="Tìm bài hát"
                    placeholderTextColor={"#fff"}
                    style={{
                        backgroundColor: "rgba(255,255,255,0.3)",
                        padding: 5,
                        color: "#fff",
                        borderRadius: 4,
                    }}
                    value={searchValue}
                    onChangeText={(e) => onSearch(e)}
                />
            </LinearGradient>
            <Animated.ScrollView
                bounces={false}
                contentContainerStyle={{
                    paddingBottom: 125,
                }}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    {
                        useNativeDriver: true,
                    }
                )}
            >
                <LinearGradient
                    colors={["midnightblue", "#121212"]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={{ zIndex: 5, width: SCREEN_WITH }}
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
                                uri: data.some(
                                    (song: Song) => song.key == currentSong.key
                                )
                                    ? currentSong.images.coverart
                                    : data[
                                          Math.floor(
                                              Math.random() * data.length
                                          )
                                      ].images.coverart,
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
                </LinearGradient>
                <Text
                    style={{
                        color: "#fff",
                        fontSize: 22,
                        fontWeight: "bold",
                        paddingLeft: 15,
                    }}
                >
                    Bài hát đã thích{" "}
                    <Text
                        style={{
                            color: "#fff",
                            fontSize: 18,
                            fontWeight: "bold",
                            paddingLeft: 15,
                        }}
                    >
                        ({data.length})
                    </Text>
                </Text>
                {searchResult?.map((song: Song) => (
                    <TouchableOpacity
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            paddingLeft: 15,
                            paddingTop: 15,
                        }}
                        onPress={() => {
                            setCurrentSong(song);
                            dispatch(setPlaying(true));
                        }}
                        key={song.key}
                    >
                        <Image
                            source={{ uri: song.images.coverart }}
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
                            <Text
                                style={{
                                    color:
                                        song.key == currentSong.key
                                            ? "#13d670"
                                            : "#fff",
                                }}
                                numberOfLines={1}
                            >
                                {song.title}
                            </Text>

                            <Text
                                style={{
                                    color: "#bdbdbd",
                                }}
                            >
                                {song.subtitle}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </Animated.ScrollView>
        </View>
    );
};

export default AlbumAndArtist;
