/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import { Entypo, AntDesign } from "@expo/vector-icons";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useSongContext } from "../context/SongProvider";
import { Line, Song } from "../types/song";
import { FlashList } from "@shopify/flash-list";
import { navigation } from "../types/RootStackParamList";
import Player from "../components/MusicPlayer/Player";
import AddToPlaylist from "../components/Modal/AddToPlaylist";
import { addToLikedList } from "../services/firebaseService";
import ImageSlider from "../components/MusicPlayer/ImageSilder/ImageSlider";
import musicService from "../services/musicService";
import { setCurrentSong } from "../redux/songSlice";
import useSyncLyric from "../hooks/useSyncLyric";
import randomCoolColorHex from "../utils/randomColor";
interface IMusicPlayerScreenProps {
    navigation: navigation<"HomeTab">;
}
const MusicPlayerScreens: React.FC<IMusicPlayerScreenProps> = ({
    navigation,
}) => {
    const { ListFavourite } = useSongContext();

    const [loading, setLoading] = useState(true);

    const song = useSelector((state: RootState) => state.song.currentSong);

    const [isLiked, setIsLiked] = useState();
    // ListFavourite.some((s: Song) => s.key == song?.key)

    const handleAddToLikedList = async (likedSong: Song) => {
        // setIsLiked(!isLiked);
        // try {
        //     await addToLikedList(likedSong, song, ListFavourite);
        // } catch (err: any) {
        //     console.log(err.message);
        // }
    };
    const goToLyricScreen = () => {
        navigation.navigate("Lyric", {
            song,
            bgColor: `yellow`,
            previousLine: 7,
        });
    };
    const lyricsRef = useRef<any>(null);

    const dispatch = useDispatch();
    React.useEffect(() => {
        // setIsLiked(ListFavourite.some((s: Song) => s.key == song.key));
    }, [ListFavourite, song?.videoId]);

    const { currentLine, getCurrentLyricLine } = useSyncLyric(song);

    React.useEffect(() => {
        const getMusicMetadata = async () => {
            const respone = await musicService.getLyric(song.title);
            dispatch(setCurrentSong({ ...song, lyrics: respone }));
            setLoading(false);
        };
        getMusicMetadata();
    }, []);

    useEffect(() => {
        lyricsRef.current?.scrollToIndex({
            index: currentLine,
            animated: true,
        });
    }, [currentLine]);

    return (
        <LinearGradient
            colors={[`#121212`, "#000000"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
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
                    <ImageSlider />
                </View>
                <View className="flex-row justify-between items-center pt-[70px] mx-[30px]">
                    <View>
                        <Text className="text-[20px] font-bold text-white">
                            {song?.title}
                        </Text>
                        <Text className="text-[13px] font-semibold text-white">
                            {song?.artists?.[0]?.name}
                        </Text>
                    </View>
                    <TouchableOpacity
                    // onPress={() => handleAddToLikedList(song)}
                    >
                        <AntDesign
                            name={isLiked ? "heart" : "hearto"}
                            size={24}
                            color={isLiked ? "#13d670" : "#fff"}
                            style={{ marginRight: 5 }}
                        />
                    </TouchableOpacity>
                </View>
                <View className="items-center mt-[15px]">
                    <Player />
                </View>
                {!song?.lyrics?.error && (
                    <>
                        {loading ? (
                            <></>
                        ) : (
                            <TouchableOpacity
                                disabled={loading}
                                activeOpacity={0.9}
                                onPress={goToLyricScreen}
                                className="mx-[20px] h-[360px] flex-1 mt-[40px] rounded-lg w-11/12 p-[10px] bg-red-700"
                            >
                                <Text className="text-[18px] text-white font-semibold pb-4">
                                    Lời bài hát
                                </Text>
                                <View className="flex-1">
                                    {song?.lyrics?.syncType !== "NOT_FOUND" && (
                                        <View className="flex-1">
                                            <FlashList
                                                ref={lyricsRef}
                                                scrollEnabled={false}
                                                estimatedItemSize={61}
                                                nestedScrollEnabled
                                                showsVerticalScrollIndicator={
                                                    false
                                                }
                                                extraData={currentLine}
                                                data={song?.lyrics?.lines}
                                                renderItem={({
                                                    item,
                                                    index,
                                                }: {
                                                    item: Line;
                                                    index: number;
                                                }) => (
                                                    <Text
                                                        style={{
                                                            opacity:
                                                                getCurrentLyricLine! >=
                                                                    index &&
                                                                song?.lyrics
                                                                    ?.syncType ===
                                                                    "LINE_SYNCED"
                                                                    ? 1
                                                                    : 0.4,
                                                            color:
                                                                getCurrentLyricLine! >=
                                                                    index &&
                                                                song?.lyrics
                                                                    ?.syncType ===
                                                                    "LINE_SYNCED"
                                                                    ? "yellow"
                                                                    : "white",
                                                            fontSize:
                                                                getCurrentLyricLine! >=
                                                                    index &&
                                                                song?.lyrics
                                                                    ?.syncType ===
                                                                    "LINE_SYNCED"
                                                                    ? 24
                                                                    : 22,
                                                        }}
                                                        className="text-white  font-bold "
                                                    >
                                                        {item.words}
                                                    </Text>
                                                )}
                                            />
                                            <Text className="self-end text-white pt-5">
                                                {song?.lyrics?.syncType ===
                                                "LINE_SYNCED"
                                                    ? "Lời bài hát đã được đồng bộ"
                                                    : "Lời bài hát chưa được đồng bộ"}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </TouchableOpacity>
                        )}
                    </>
                )}

                <AddToPlaylist />
            </ScrollView>
        </LinearGradient>
    );
};

export default MusicPlayerScreens;
