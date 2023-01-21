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
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";

import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import { useSongContext } from "../context/SongProvider";
import { db } from "../firebase/index";
import { Song } from "../types/song";
import { useDispatch } from "react-redux";
import { setCurrentSong } from "../redux/songSlice";
import SongImage from "../components/MusicPlayer//SongImage";
import { FlashList } from "@shopify/flash-list";
import { navigation } from "../types/RootStackParamList";
import Player from "../components/MusicPlayer/Player";
import AddToPlaylist from "../components/Modal/AddToPlaylist";

const { width: SCREEN_WIDTH } = Dimensions.get("screen");
const SCROLL_VIEW_HEIGHT = 350;
interface IMusicPlayerScreenProps {
    navigation: navigation<"HomeTab">;
}

const MusicPlayerScreens: React.FC<IMusicPlayerScreenProps> = ({
    navigation,
}) => {
    const { ListFavourite, isShuffle } = useSongContext();

    const [playList] = React.useState<Song[]>(ListFavourite);

    const dispatch = useDispatch();

    const song = useSelector((state: RootState) => state.song.currentSong);

    const currentSongIndex = playList.findIndex((s: Song) => s.key == song.key);

    const [isLiked, setIsLiked] = useState(
        ListFavourite.some((s: Song) => s.key == song.key)
    );

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
    const flatListRef = React.createRef<FlashList<Song>>();

    useEffect(() => {
        setIsLiked(ListFavourite.some((s: Song) => s.key == song.key));
    }, [song, ListFavourite]);

    useEffect(() => {
        flatListRef.current?.scrollToIndex({
            index: currentSongIndex == -1 ? 0 : currentSongIndex,
            animated: isShuffle ? false : true,
        });
    }, [song.key]);

    function onChangeSong(e: NativeSyntheticEvent<NativeScrollEvent>) {
        const pageNum = Math.min(
            Math.max(
                Math.floor(e.nativeEvent.contentOffset.x / SCREEN_WIDTH + 0.5) +
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
                <View className="mt-[35px] justify-between items-center flex-row px-[15px]">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
                    >
                        <AntDesign name="down" size={24} color="#fff" />
                    </TouchableOpacity>
                    <View className="items-center justify-center">
                        <Text className="text-white uppercase text-[12px]">
                            Đang phát từ thư viện
                        </Text>
                        <Text className="text-white font-bold text-[12px]">
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
                        contentContainerStyle={{ paddingTop: 65 }}
                        initialScrollIndex={currentSongIndex}
                        horizontal
                        estimatedItemSize={SCREEN_WIDTH}
                        pagingEnabled
                        data={playList}
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
                    <Player playList={playList} />
                    <ScrollView
                        nestedScrollEnabled
                        contentContainerStyle={{
                            ...styles.scrollView,
                            backgroundColor: `#${
                                song?.images?.joecolor?.split(":")[5]
                            }`,
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
                <AddToPlaylist />
            </ScrollView>
        </LinearGradient>
    );
};

export default MusicPlayerScreens;
const styles = StyleSheet.create({
    scrollView: {
        marginHorizontal: 20,
        borderRadius: 10,
        marginTop: 40,
        height: SCROLL_VIEW_HEIGHT,
        width: SCREEN_WIDTH * 0.9,
        paddingBottom: 50,
        padding: 10,
    },
});
