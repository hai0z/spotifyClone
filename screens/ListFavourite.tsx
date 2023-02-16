import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    TextInput,
    Image,
    ScrollView,
    StatusBar,
    SafeAreaView,
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
import { useNavigation } from "@react-navigation/native";

const { width: SCREEN_WITH } = Dimensions.get("screen");

const ListFavourite = ({ route }: { route: route<"ListFavourite"> }) => {
    const { type, playlistName } = route.params;

    const dispatch = useDispatch();

    const currentSong = useSelector(
        (state: RootState) => state.song.currentSong
    );

    const navigation = useNavigation();
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

    const opacity = scrollY.interpolate({
        inputRange: [0, 32],
        outputRange: [1, 0],
    });
    const scrollViewRef = React.useRef<ScrollView>(null);

    const headerAnim = scrollY.interpolate({
        inputRange: [160, 180],
        outputRange: [0, 1],
        extrapolate: "clamp",
    });
    const headerColorAnim = scrollY.interpolate({
        inputRange: [140, 180],
        outputRange: ["transparent", "#122d5a"],
        extrapolate: "clamp",
    });
    const lastOffsetY = React.useRef(0);
    const scrollDirection = React.useRef("");

    const statusBarColor = React.useState("#0F52BA");
    return (
        <SafeAreaView>
            <StatusBar backgroundColor="#122d5a" />
            <Animated.View
                className="pl-4 z-10 w-full h-16 flex-row items-center absolute top-[20px]"
                style={{
                    backgroundColor: headerColorAnim,
                }}
            >
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign name="arrowleft" color={"#fff"} size={28} />
                </TouchableOpacity>
                <Animated.Text
                    className="text-white font-bold pl-6 text-[16px]"
                    style={{
                        opacity: headerAnim,
                    }}
                >
                    Bài hát đã thích
                </Animated.Text>
            </Animated.View>
            <Animated.ScrollView
                ref={scrollViewRef}
                className="bg-[#121212]"
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
            >
                <LinearGradient
                    colors={["#0F52BA70", "#2554C760", "#121212"]}
                    className="w-full h-80"
                >
                    <Animated.View className="flex-row mx-3 mt-[90px] justify-center">
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
                            className="h-10 bg-[#ffffff50] items-center justify-center px-5 rounded-sm ml-2 "
                        >
                            <Text className="text-white font-medium text-[12px]">
                                Sắp xếp
                            </Text>
                        </Animated.View>
                    </Animated.View>
                    <View className="mx-3 mt-28">
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
            </Animated.ScrollView>
        </SafeAreaView>
    );
};

export default ListFavourite;
