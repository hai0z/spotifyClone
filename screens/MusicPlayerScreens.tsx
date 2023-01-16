import {
    Text,
    View,
    Dimensions,
    ScrollView,
    TouchableOpacity,
    NativeSyntheticEvent,
    NativeScrollEvent,
    StyleSheet,
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
import { FlashList } from "@shopify/flash-list";
import { navigation } from "../types/RootStackParamList";

const { width: SCREEN_WITH } = Dimensions.get("screen");

interface IMusicPlayerScreenProps {
    navigation: navigation<"HomeTab">;
}

const MusicPlayerScreens: React.FC<IMusicPlayerScreenProps> = ({
    navigation,
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
            colors={[`#${song?.images?.joecolor?.split(":")[5]}`, "#000000"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            className="flex-1"
        >
            <ScrollView
                contentContainerStyle={{ paddingBottom: 50 }}
                showsVerticalScrollIndicator={false}
            >
                <View
                    style={{
                        paddingHorizontal: 15,
                    }}
                    className="mt-[35px] justify-between items-center flex-row"
                >
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
                    >
                        <AntDesign name="down" size={24} color="#fff" />
                    </TouchableOpacity>
                    <View className="items-center justify-center">
                        <Text className="text-white uppercase">
                            Đang phát từ thư viện
                        </Text>
                        <Text className="text-white font-bold">
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
                <View className="flex-row justify-between items-center pt-[70px] mx-[30px]">
                    <View>
                        <Text className="text-[20px] font-bold text-white">
                            {songTitle}
                        </Text>
                        <Text className="text-[13px] font-semibold text-white">
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
                <View className="items-center mt-[15px]">
                    <Slider
                        style={{
                            width: SCREEN_WITH - 40,
                        }}
                        minimumValue={0}
                        maximumValue={100}
                        thumbTintColor="#ffffff"
                        minimumTrackTintColor="#ffffff"
                        maximumTrackTintColor="rgba(255,255,255,0.5)"
                        onSlidingComplete={(value) => {
                            playFromPosition(
                                (musicState.duration * value) / 100
                            );
                        }}
                        value={
                            (musicState.position / musicState.duration) * 100 ||
                            0
                        }
                    />
                    <View
                        style={{ width: SCREEN_WITH - 70 }}
                        className={`flex-row justify-between`}
                    >
                        <Text className="text-stone-300 font-semibold text-[12px]">
                            {min}:{second}
                        </Text>
                        <Text className="text-white font-semibold text-[12px]">
                            {totalTime}
                        </Text>
                    </View>
                    <View
                        style={{ width: SCREEN_WITH - 40 }}
                        className="flex-row justify-between items-center mt-[5px]"
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
                                    className="text-white text-[30px] font-semibold"
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
