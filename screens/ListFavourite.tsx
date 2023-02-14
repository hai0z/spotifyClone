import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    TextInput,
    Image,
    ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
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

const Max_Header_Height = 80;
const Min_Header_Height = 40;
const Scroll_Distance = Max_Header_Height - Min_Header_Height;

const ListFavourite = ({ route }: { route: route<"ListFavourite"> }) => {
    const { type, playlistName } = route.params;

    const dispatch = useDispatch();

    const currentSong = useSelector(
        (state: RootState) => state.song.currentSong
    );

    const { ListFavourite: data } = useSongContext();

    const inputRef = React.createRef<TextInput>();

    const [searchValue, setSearchValue] = useState("");

    const [searchResult, setSearchResult] = useState<Song[]>(data);

    const [isSearching, setIsSearching] = useState(false);

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
        dispatch(
            setPlaying({
                isPlaying: true,
                playFrom: {
                    name: "Bài hát đã thích",
                    from: "library",
                },
            })
        );
    }, []);

    const onSearch = (songName: string) => {
        setSearchValue(songName);
        if (songName.trim().length == 0 || songName.trim() == "") {
            setSearchResult(data);
        } else {
            setSearchResult(
                data.filter((song: Song) =>
                    stringToSlug(song.title.toLowerCase()).includes(
                        stringToSlug(songName.toLowerCase())
                    )
                )
            );
        }
    };
    const { displayAnimation } = usePlayerAnimation();

    const memo = React.useCallback(() => displayAnimation(), []);

    const scrollY = React.useRef(new Animated.Value(0)).current;

    const animatedHeaderHeight = scrollY.interpolate({
        inputRange: [0, Scroll_Distance * 5],
        outputRange: [Max_Header_Height, Min_Header_Height],
        extrapolate: "clamp",
    });
    const animateHeaderBackgroundColor = scrollY.interpolate({
        inputRange: [0, Max_Header_Height * 2 - Min_Header_Height * 2],
        outputRange: ["transparent", "indigo"],
        extrapolate: "clamp",
    });

    const opacity = scrollY.interpolate({
        inputRange: [0, 32],
        outputRange: [1, 0],
    });
    const scrollViewRef = React.useRef<ScrollView>(null);

    const heightAnim = scrollY.interpolate({
        inputRange: [0, 16, 32],
        outputRange: [160, 150, 130],
        extrapolate: "clamp",
    });
    const lastOffsetY = React.useRef(0);
    const scrollDirection = React.useRef("");
    return (
        <ScrollView
            ref={scrollViewRef}
            stickyHeaderIndices={[0]}
            className="relative bg-[#121212]"
            onScroll={(event) => {
                const offsetY = event.nativeEvent.contentOffset.y;
                scrollDirection.current =
                    offsetY - lastOffsetY.current > 0 ? "down" : "up";
                lastOffsetY.current = offsetY;
                scrollY.setValue(offsetY);
            }}
            onScrollEndDrag={() => {
                scrollViewRef.current?.scrollTo({
                    y: scrollDirection.current === "down" ? 100 : 0,
                    animated: true,
                });
            }}
        >
            <View className="pl-2 pt-10 bg-transparent z-10 justify-center">
                <AntDesign name="arrowleft" color={"#fff"} size={28} />
            </View>
            <LinearGradient
                colors={["#0F52BA70", "#2554C760", "#121212"]}
                className="w-full h-64 "
            >
                <Animated.View
                    className="flex-row mx-3 my-4 justify-betweens"
                    style={{
                        height: heightAnim,
                    }}
                >
                    <Animated.View
                        style={{ opacity }}
                        className="w-9/12 h-10 rounded-sm bg-[#ffffff60] flex-row items-center px-2"
                    >
                        <AntDesign name="search1" size={24} color="#fff" />
                        <Text className="text-white font-medium pl-1 text-[12px]">
                            Tìm trong bài hát đã thích
                        </Text>
                    </Animated.View>
                    <Animated.View
                        style={{ opacity }}
                        className="h-10 bg-[#ffffff50] items-center justify-center px-5 rounded-sm  "
                    >
                        <Text className="text-white font-medium text-[12px]">
                            Sắp xếp
                        </Text>
                    </Animated.View>
                </Animated.View>
                <View className="mx-3">
                    <Text className="text-white font-bold text-[24px]">
                        Bài hát đã thích
                    </Text>
                    <Text className="text-gray-500 text-[12px]  pt-2">
                        {data?.length} bài hát
                    </Text>
                </View>
            </LinearGradient>
            <View className="min-h-screen">
                <SongList
                    searchResult={searchResult}
                    playSong={playSong}
                    displayAnimation={memo}
                />
            </View>
        </ScrollView>
    );
};

export default ListFavourite;
