import {
    View,
    Image,
    TouchableOpacity,
    Dimensions,
    Animated,
} from "react-native";
import React, { useState } from "react";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useSongContext } from "../../context/SongProvider";
import { navigation } from "../../types/RootStackParamList";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import useSound from "../../hooks/useSound";
import { Song } from "../../types/song";
import usePlayerAnimation from "../../hooks/usePlayerAnimation";
import { addToLikedList } from "../../services/firebaseService";

const { width: SCREEN_WIDTH } = Dimensions.get("screen");
interface IMusciPayerProp {
    navigation: navigation<"HomeTab">;
}

const MusicPlayer: React.FC<IMusciPayerProp> = ({ navigation }) => {
    const musicState = useSelector((state: RootState) => state.song.musicState);

    const currentSong = useSelector(
        (state: RootState) => state.song.currentSong
    );

    const { ListFavourite } = useSongContext();

    const [joeColor, setJoeColor] = useState("#cccccc");

    const { sound, onPlayPause } = useSound();

    const [isLiked, setIsLiked] = useState(
        ListFavourite.some((s: Song) => s.key == currentSong.key)
    );

    const handleAddToLikedList = async (likedSong: Song) => {
        console.log("likeee");
        setIsLiked(!isLiked);
        try {
            await addToLikedList(likedSong, currentSong, ListFavourite);
        } catch (err: any) {
            console.log(err);
        }
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
        setIsLiked(ListFavourite.some((s: Song) => s.key == currentSong.key));
    }, [ListFavourite, currentSong.key]);

    React.useEffect(() => {
        setJoeColor(`#${currentSong?.images?.joecolor?.split(":")?.[5]}`);
    }, [currentSong]);

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
                style={{ backgroundColor: `${joeColor}` }}
                className="flex-col rounded-md justify-center w-[100%] h-[100%]"
            >
                <View className="flex-row justify-between items-center">
                    <View>
                        <Image
                            source={{
                                uri: currentSong?.images?.coverart,
                            }}
                            className="object-cover w-10 h-10 rounded-[5px] ml-[7px] z-50"
                        />
                    </View>
                    <View style={{ marginLeft: 10, maxWidth: "60%" }}>
                        <Animated.Text
                            numberOfLines={1}
                            style={{ transform: [{ translateX }], opacity }}
                            className="text-white font-semibold text-[14px] "
                        >
                            {currentSong?.title}
                        </Animated.Text>
                        <Animated.Text
                            style={{ transform: [{ translateX }], opacity }}
                            numberOfLines={1}
                            className="text-white text-[12px] font-normal"
                        >
                            {currentSong?.subtitle}
                        </Animated.Text>
                    </View>
                    <View className="ml-auto flex-row items-center justify-between">
                        <TouchableOpacity
                            onPress={() => handleAddToLikedList(currentSong)}
                        >
                            <AntDesign
                                name={isLiked ? "heart" : "hearto"}
                                size={24}
                                color={isLiked ? "#13d670" : "#fff"}
                                style={{ marginRight: 15 }}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onPlayPause}>
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
