import {
    View,
    Image,
    TouchableOpacity,
    Dimensions,
    Animated,
    ActivityIndicator,
} from "react-native";
import React, { useMemo, useState } from "react";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useSongContext } from "../../context/SongProvider";
import { navigation } from "../../types/RootStackParamList";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import useSound from "../../hooks/useSound";
import { ISong, Song } from "../../types/song";
import usePlayerAnimation from "../../hooks/usePlayerAnimation";
import { addToLikedList } from "../../services/firebaseService";
import { useNavigation } from "@react-navigation/native";
const { width: SCREEN_WIDTH } = Dimensions.get("screen");
import useImageColors from "../../hooks/useImageColor";
const MusicPlayer: React.FC = () => {
    const navigation = useNavigation<navigation<"MusicPlayer">>();
    const musicState = useSelector((state: RootState) => state.song.musicState);

    const { currentSong, songLoaded } = useSelector(
        (state: RootState) => state.song
    );
    const { ListFavourite } = useSongContext();

    const { joeColor } = useSongContext();

    const { sound, onPlayPause } = useSound();

    const [isLiked, setIsLiked] = useState(
        ListFavourite.some((s: ISong) => s.videoId == currentSong?.videoId)
    );

    const handleAddToLikedList = async (likedSong: Song) => {
        // console.log("likeee");
        // setIsLiked(!isLiked);
        // try {
        //     await addToLikedList(likedSong, currentSong, ListFavourite);
        // } catch (err: any) {
        //     console.log(err);
        // }
    };

    const getProgress = () => {
        if (
            musicState.position == null ||
            musicState.duration == null ||
            sound == null
        ) {
            return 0;
        }
        return (musicState.position / musicState.duration) * 100;
    };

    React.useEffect(() => {
        // setIsLiked(ListFavourite.some((s: Song) => s.key == currentSong?.key));
    }, [ListFavourite, currentSong?.videoId]);

    const { playerAnimation } = usePlayerAnimation();

    const translateX = playerAnimation.interpolate({
        inputRange: [50, 58, 65],
        outputRange: [150, 50, 0],
    });

    const opacity = playerAnimation.interpolate({
        inputRange: [50, 58, 65],
        outputRange: [0, 0.3, 1],
    });

    return (
        <Animated.View
            style={{
                bottom: playerAnimation,
                transform: [
                    {
                        translateX: (SCREEN_WIDTH - SCREEN_WIDTH * 0.96) / 2,
                    },
                ],
            }}
            className={`absolute w-[96%] h-[55px] z-[1]`}
        >
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                    navigation.navigate("MusicPlayer");
                }}
                style={{ backgroundColor: joeColor?.colors?.dominant?.hex }}
                className="flex-col rounded-md justify-center w-[100%] h-[100%]"
            >
                <View className="flex-row justify-between items-center">
                    {!songLoaded ? (
                        <View className="bg-gray-600 w-10 h-10 rounded-[5px] ml-[7px] z-50 justify-center items-center">
                            <ActivityIndicator
                                size={"small"}
                                animating={false}
                            />
                        </View>
                    ) : (
                        <View>
                            <Image
                                source={{
                                    uri: currentSong?.thumbnails?.[0].url,
                                }}
                                className="object-cover w-10 h-10 rounded-[5px] ml-[7px] z-50"
                            />
                        </View>
                    )}
                    <View style={{ marginLeft: 10, maxWidth: "60%" }}>
                        {!songLoaded ? (
                            <View className="h-2 bg-gray-400 w-32"></View>
                        ) : (
                            <Animated.Text
                                numberOfLines={1}
                                style={{ transform: [{ translateX }], opacity }}
                                className="text-white font-semibold text-[14px]"
                            >
                                {currentSong?.title}
                            </Animated.Text>
                        )}
                        {!songLoaded ? (
                            <View className="h-2 bg-gray-400 w-16 mt-3"></View>
                        ) : (
                            <Animated.Text
                                style={{ transform: [{ translateX }], opacity }}
                                numberOfLines={1}
                                className="text-white text-[12px] font-normal"
                            >
                                {currentSong?.artists?.[0]?.name}
                            </Animated.Text>
                        )}
                    </View>
                    <View className="ml-auto flex-row items-center justify-between">
                        <TouchableOpacity
                        // onPress={() => handleAddToLikedList(currentSong)}
                        >
                            <AntDesign
                                name={isLiked ? "heart" : "hearto"}
                                size={24}
                                color={isLiked ? "#13d670" : "#fff"}
                                style={{ marginRight: 15 }}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onPlayPause}>
                            {songLoaded ? (
                                <Entypo
                                    name={
                                        !musicState.isPlaying
                                            ? "controller-play"
                                            : "controller-paus"
                                    }
                                    size={30}
                                    color="#fff"
                                    style={{ marginRight: 15 }}
                                />
                            ) : (
                                <ActivityIndicator
                                    size={24}
                                    style={{ marginRight: 15 }}
                                    color={"#fff"}
                                />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
            <View className="h-[2.5px] max-w-[100%] relative mx-[8px] bottom-1 rounded-[2.5px] bg-[#ffffff50]">
                <View
                    style={{ width: `${getProgress()}%` }}
                    className="h-[2.5px] bg-[#fff] max-w-[100%] absolute rounded-l-[2.5px]"
                />
            </View>
        </Animated.View>
    );
};
export default React.memo(MusicPlayer);
