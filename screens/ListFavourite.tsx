import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Animated } from "react-native";
import { useSongContext } from "../context/SongProvider";
import { Song } from "../types/song";
import { useDispatch } from "react-redux";
import { setCurrentSong, setPlaying } from "../redux/songSlice";
import { LinearGradient } from "expo-linear-gradient";
import stringToSlug from "../utils/removeSign";
import { AntDesign } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

import SongList from "../components/MusicPlayer/SongList";
import usePlayerAnimation from "../hooks/usePlayerAnimation";
import { route } from "../types/RootStackParamList";
import { db } from "../firebase";

const { width: SCREEN_WITH } = Dimensions.get("screen");

const AlbumAndArtist = ({ route }: { route: route<"ListFavourite"> }) => {
    const { type, playlistName } = route.params;

    const scrollY = React.useRef(new Animated.Value(0)).current;
    const dispatch = useDispatch();

    const currentSong = useSelector(
        (state: RootState) => state.song.currentSong
    );

    const { ListFavourite: data } = useSongContext();

    const inputRef = React.createRef<TextInput>();

    const [searchValue, setSearchValue] = useState("");

    const [searchResult, setSearchResult] = useState<Song[]>([]);

    const [isSearching, setIsSearching] = useState(false);

    const inputRange = [-150, 0, 120, 140];

    const scale = scrollY.interpolate({
        inputRange,
        outputRange: [1.5, 1, 0.3, 0],
        extrapolate: "clamp",
    });
    const opacity = scrollY.interpolate({
        inputRange: [-100, 0, 100, 120],
        outputRange: [0, 1, 0.3, 0],
        extrapolate: "clamp",
    });
    const translateY = scrollY.interpolate({
        inputRange,
        outputRange: [0, 0, -120, -120],
        extrapolate: "clamp",
    });

    React.useEffect(() => {
        if (type == "favourite") {
            setSearchResult(data);
            return;
        }
        if (type == "playlist") {
            const getPlayList = () => {
                const q = db.query(
                    db.collection(
                        db.getFirestore(),
                        "playlist",
                        `${playlistName}/playlist`
                    )
                );
                db.onSnapshot(q, (querySnapshot) => {
                    const pl: Song[] = [];
                    querySnapshot.forEach((doc) => {
                        pl.push(doc.data() as Song);
                    });
                    setSearchResult(pl as Song[]);
                });
            };
            getPlayList();
        }
    }, []);

    const playSong = React.useCallback((song: Song) => {
        dispatch(setCurrentSong(song));
        dispatch(setPlaying({ isPlaying: true, playFrom: "likedList" }));
    }, []);

    const onSearch = (songName: string) => {
        setSearchValue(songName);
        if (songName.trim().length == 0 || songName.trim() == "") {
            setSearchResult(data);
        } else {
            setSearchResult(
                data.filter((song: any) =>
                    stringToSlug(song.title.toLowerCase()).includes(
                        stringToSlug(songName.toLowerCase())
                    )
                )
            );
        }
    };
    const { displayAnimation } = usePlayerAnimation();

    const memo = React.useCallback(() => displayAnimation(), []);

    const songImg = data.some((song: Song) => song.key == currentSong.key)
        ? currentSong.images.coverart
        : data[Math.floor(Math.random() * data.length)].images.coverart;

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                backgroundColor: "#121212",
                position: "relative",
            }}
        >
            <View
                style={{
                    paddingTop: 50,
                    paddingHorizontal: 15,
                    paddingBottom: 20,
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: `#${
                        currentSong?.images?.joecolor?.split(":")[5]
                    }CE`,
                }}
            >
                {isSearching && (
                    <TouchableOpacity
                        onPress={() => {
                            setIsSearching(false);
                            inputRef.current?.blur();
                            setSearchValue("");
                            setSearchResult(data);
                        }}
                    >
                        <AntDesign name="arrowleft" color={"#fff"} size={24} />
                    </TouchableOpacity>
                )}
                <Animated.View
                    style={{
                        width: "100%",
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
                            marginLeft: isSearching ? 20 : 0,
                            width: isSearching ? "80%" : "100%",
                        }}
                        onFocus={() => {
                            setIsSearching(true);
                        }}
                        value={searchValue}
                        onChangeText={(e) => onSearch(e)}
                        ref={inputRef}
                    />
                </Animated.View>
            </View>

            <Animated.ScrollView
                nestedScrollEnabled
                bounces={false}
                contentContainerStyle={{
                    paddingBottom: 125,
                }}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    {
                        useNativeDriver: false,
                    }
                )}
            >
                <LinearGradient
                    colors={[
                        `#${currentSong?.images?.joecolor?.split(":")[5]}CE`,
                        "#121212",
                    ]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={{ width: SCREEN_WITH }}
                >
                    <Animated.View
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                            transform: [{ scale }],
                        }}
                    >
                        {!isSearching && (
                            <Animated.Image
                                source={{
                                    uri: songImg,
                                }}
                                style={{
                                    width: 300,
                                    height: 300,
                                    resizeMode: "cover",
                                    marginBottom: 20,
                                    opacity,
                                }}
                            />
                        )}
                    </Animated.View>
                </LinearGradient>

                <Animated.View
                    style={{
                        flex: 1,
                        minHeight: "100%",
                        transform: [{ translateY }],
                    }}
                >
                    {!isSearching && (
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
                    )}
                    <SongList
                        searchResult={searchResult}
                        playSong={playSong}
                        displayAnimation={memo}
                    />
                </Animated.View>
            </Animated.ScrollView>
        </View>
    );
};

export default AlbumAndArtist;
