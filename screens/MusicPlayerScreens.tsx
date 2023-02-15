import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import { Entypo, AntDesign } from "@expo/vector-icons";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import { useSongContext } from "../context/SongProvider";
import { Song } from "../types/song";
import { FlashList } from "@shopify/flash-list";
import { navigation } from "../types/RootStackParamList";
import Player from "../components/MusicPlayer/Player";
import AddToPlaylist from "../components/Modal/AddToPlaylist";
import { addToLikedList } from "../services/firebaseService";
import ImageSlider from "../components/MusicPlayer/ImageSilder/ImageSlider";
interface IMusicPlayerScreenProps {
    navigation: navigation<"HomeTab">;
}

const MusicPlayerScreens: React.FC<IMusicPlayerScreenProps> = ({
    navigation,
}) => {
    const { ListFavourite } = useSongContext();

    const song = useSelector((state: RootState) => state.song.currentSong);

    const [isLiked, setIsLiked] = useState(
        ListFavourite.some((s: Song) => s.key == song?.key)
    );

    const handleAddToLikedList = async (likedSong: Song) => {
        setIsLiked(!isLiked);
        try {
            await addToLikedList(likedSong, song, ListFavourite);
        } catch (err: any) {
            console.log(err.message);
        }
    };
    const goToLyricScreen = () => {
        navigation.navigate("Lyric", {
            song,
            bgColor: `${song?.images?.joecolor?.split(":")[5]}`,
        });
    };

    React.useEffect(() => {
        setIsLiked(ListFavourite.some((s: Song) => s.key == song.key));
    }, [ListFavourite, song?.key]);

    return (
        <LinearGradient
            colors={[`#${song?.images?.joecolor?.split(":")[5]}`, "#000000"]}
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
                            {song.title}
                        </Text>
                        <Text className="text-[13px] font-semibold text-white">
                            {song.subtitle}
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => handleAddToLikedList(song)}
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
                {!!song.sections?.[1].text && (
                    <TouchableOpacity
                        onPress={goToLyricScreen}
                        activeOpacity={1}
                        className="mx-[20px] h-[360px]  mt-[40px] rounded-lg w-11/12 p-[10px] overflow-hidden pb-4"
                        style={{
                            backgroundColor: `#${
                                song?.images?.joecolor?.split(":")[5]
                            }`,
                        }}
                    >
                        <Text className="text-[18px] text-white font-semibold pb-4">
                            Lời bài hát
                        </Text>
                        <FlashList
                            scrollEnabled={false}
                            estimatedItemSize={30}
                            showsVerticalScrollIndicator={false}
                            nestedScrollEnabled
                            data={song.sections?.[1].text}
                            renderItem={({ item }: { item: string }) => (
                                <View className="h-8">
                                    <Text className="text-white text-[22px] font-bold ">
                                        {item}
                                    </Text>
                                </View>
                            )}
                        />
                    </TouchableOpacity>
                )}
                <AddToPlaylist />
            </ScrollView>
        </LinearGradient>
    );
};

export default MusicPlayerScreens;
