import {
    Text,
    View,
    Dimensions,
    ScrollView,
    TouchableOpacity,
    NativeSyntheticEvent,
    NativeScrollEvent,
    StyleSheet,
    Animated,
} from "react-native";
import { Entypo, AntDesign } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import { useSongContext } from "../context/SongProvider";
import { db } from "../firebase/index";
import useSound from "../hooks/useSound";
import { Song } from "../types/song";
import { useDispatch } from "react-redux";
import { setCurrentSong } from "../redux/songSlice";
import SongImage from "../components/MusicPlayer//SongImage";
import FlashList from "@shopify/flash-list/dist/FlashList";
import { navigation } from "../types/RootStackParamList";

const { width: SCREEN_WITH } = Dimensions.get("screen");

const MusicPlayerScreens = ({
    navigation,
}: {
    navigation: navigation<"HomeTab">;
}) => {
    const { isLooping, setIsLooping, ListFavourite } = useSongContext();

    const dispatch = useDispatch();

    const song = useSelector((state: RootState) => state.song.currentSong);

    const currentSongIndex = React.useMemo(
        () => ListFavourite.findIndex((s: Song) => s.key == song.key),
        [song.key]
    );

    const [isLiked, setIsLiked] = useState(
        ListFavourite.some((s: any) => s.key == song.key)
    );

    const musicState = useSelector((state: RootState) => state.song.musicState);

    const { onPlayPause, playFromPosition } = useSound();

    let second: string | number = React.useMemo(() => {
        return Math.floor((musicState.position / 1000) % 60);
    }, [musicState.position]);

    if (second < 10) {
        second = "0" + second;
    }
    const min = React.useMemo(
        () => Math.floor((musicState.position / 1000 / 60) % 60),
        [musicState.position]
    );

    const totalTime = React.useMemo(
        () =>
            `${Math.floor((musicState.duration / 1000 / 60) % 60)}:${Math.floor(
                (musicState.duration / 1000) % 60
            )}`,
        [song.key]
    );

    const memoListData = React.useMemo(() => ListFavourite, []);
    const songTitle = React.useMemo(() => song.title, [song.key]);
    const subTitle = React.useMemo(() => song.subtitle, [song.key]);

    const addToLikedList = async (likedSong: Song) => {
        console.log(1);
        setIsLiked(!isLiked);
        try {
            const docRef = db.doc(db.getFirestore(), "likedList", song.key);
            if (ListFavourite.some((s: Song) => s.key == likedSong.key)) {
                await db.deleteDoc(docRef);
            } else {
                await db.setDoc(docRef, likedSong);
            }
        } catch (err: any) {
            console.log(err.message);
        }
    };
    const flatListRef = React.createRef<FlashList<any>>();

    useEffect(() => {
        setIsLiked(ListFavourite.some((s: Song) => s.key == song.key));
    }, [song, ListFavourite]);

    useEffect(() => {
        flatListRef.current?.scrollToIndex({
            index: currentSongIndex == -1 ? 0 : currentSongIndex,
            animated: true,
        });
    }, [song.key]);

    function onChangeSong(e: NativeSyntheticEvent<NativeScrollEvent>) {
        const pageNum = Math.min(
            Math.max(
                Math.floor(e.nativeEvent.contentOffset.x / SCREEN_WITH + 0.5) +
                    1,
                0
            ),
            ListFavourite.length
        );
        pageNum - 1 != currentSongIndex &&
            dispatch(setCurrentSong(ListFavourite[pageNum - 1]));
    }
    return (
        <LinearGradient
            style={{ flex: 1 }}
            colors={[`#${song?.images?.joecolor?.split(":")[5]}CE`, "#000000"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
        >
            <ScrollView
                contentContainerStyle={{ paddingBottom: 50 }}
                showsVerticalScrollIndicator={false}
            >
                <View
                    style={{
                        marginTop: 35,
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexDirection: "row",
                        paddingHorizontal: 15,
                    }}
                >
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
                    >
                        <AntDesign name="down" size={24} color="#fff" />
                    </TouchableOpacity>
                    <View
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Text
                            style={{
                                color: "#fff",
                                textTransform: "uppercase",
                            }}
                        >
                            Đang phát từ thư viện
                        </Text>
                        <Text style={{ color: "#fff", fontWeight: "bold" }}>
                            Bài hát đã thích
                        </Text>
                    </View>
                    <Entypo name="dots-three-vertical" size={18} color="#fff" />
                </View>
                <View>
                    <FlashList
                        keyExtractor={(item) => item.key}
                        scrollEventThrottle={32}
                        onMomentumScrollEnd={onChangeSong}
                        ref={flatListRef}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingTop: 65,
                        }}
                        initialScrollIndex={currentSongIndex}
                        horizontal
                        estimatedItemSize={SCREEN_WITH}
                        pagingEnabled
                        data={memoListData}
                        renderItem={({ item }) => <SongImage item={item} />}
                    />
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        paddingTop: 70,
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginHorizontal: 30,
                    }}
                >
                    <View>
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: "bold",
                                color: "#fff",
                            }}
                        >
                            {songTitle}
                        </Text>
                        <Text
                            style={{
                                fontSize: 13,
                                fontWeight: "500",
                                color: "#fff",
                            }}
                        >
                            {subTitle}
                        </Text>
                    </View>
                    <TouchableOpacity onPress={() => addToLikedList(song)}>
                        <AntDesign
                            name={isLiked ? "heart" : "hearto"}
                            size={24}
                            color={isLiked ? "#13d670" : "#fff"}
                            style={{ marginRight: 5 }}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{ alignItems: "center", marginTop: 15 }}>
                    <Slider
                        style={{
                            width: SCREEN_WITH - 40,
                        }}
                        minimumValue={0}
                        value={
                            (musicState.position / musicState.duration) * 100 ||
                            0
                        }
                        maximumValue={100}
                        thumbTintColor="#ffffff"
                        minimumTrackTintColor="#ffffff"
                        maximumTrackTintColor="rgba(255,255,255,0.5)"
                        onSlidingComplete={(e) => {
                            playFromPosition((musicState.duration * e) / 100);
                        }}
                    />
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            width: SCREEN_WITH - 70,
                        }}
                    >
                        <Text
                            style={{
                                color: "rgba(255,255,255,0.5)",
                                fontWeight: "500",
                                fontSize: 12,
                            }}
                        >
                            {min}:{second}
                        </Text>
                        <Text
                            style={{
                                color: "#fff",
                                fontWeight: "500",
                                fontSize: 12,
                            }}
                        >
                            {totalTime}
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            width: SCREEN_WITH - 40,
                            alignItems: "center",
                            marginTop: 5,
                        }}
                    >
                        <TouchableOpacity style={styles.trackBtn}>
                            <FontAwesome
                                name="random"
                                size={24}
                                color="white"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.trackBtn}
                            onPress={() => {
                                currentSongIndex != 0 &&
                                    dispatch(
                                        setCurrentSong(
                                            ListFavourite[currentSongIndex - 1]
                                        )
                                    );
                            }}
                        >
                            <AntDesign
                                name="stepbackward"
                                size={32}
                                color="white"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => onPlayPause()}
                            style={styles.playBtn}
                        >
                            <Entypo
                                name={
                                    !musicState.isPlaying
                                        ? "controller-play"
                                        : "controller-paus"
                                }
                                size={36}
                                color="#000"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                if (
                                    currentSongIndex ===
                                    ListFavourite.length - 1
                                ) {
                                    dispatch(setCurrentSong(ListFavourite[0]));
                                } else {
                                    dispatch(
                                        setCurrentSong(
                                            ListFavourite[currentSongIndex + 1]
                                        )
                                    );
                                }
                            }}
                            style={styles.trackBtn}
                        >
                            <AntDesign
                                name="stepforward"
                                size={32}
                                color="white"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.trackBtn}
                            onPress={() => setIsLooping(!isLooping)}
                        >
                            <SimpleLineIcons
                                name="loop"
                                size={24}
                                color={isLooping ? "#13d670" : "white"}
                            />
                        </TouchableOpacity>
                    </View>
                    <ScrollView
                        nestedScrollEnabled
                        contentContainerStyle={{
                            backgroundColor: `#${
                                song?.images?.joecolor?.split(":")[5]
                            }`,
                            marginHorizontal: 20,
                            borderRadius: 10,
                            marginTop: 40,
                            height: 350,
                            width: SCREEN_WITH * 0.9,
                            paddingBottom: 50,
                            padding: 10,
                        }}
                    >
                        {song.sections?.[1].text?.map(
                            (l: string, i: number) => (
                                <Text
                                    style={{
                                        color: "#ffff",
                                        fontSize: 30,
                                        fontWeight: "600",
                                    }}
                                    key={i}
                                >
                                    {l}
                                </Text>
                            )
                        )}
                    </ScrollView>
                </View>
            </ScrollView>
        </LinearGradient>
    );
};

export default MusicPlayerScreens;
const styles = StyleSheet.create({
    trackBtn: {
        width: 60,
        height: 60,
        justifyContent: "center",
        alignItems: "center",
    },
    playBtn: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
    },
});
