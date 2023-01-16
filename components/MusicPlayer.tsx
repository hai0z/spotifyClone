import {
    View,
    Image,
    TouchableOpacity,
    Dimensions,
    Animated,
} from "react-native";
import React, { useRef, useState } from "react";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useSongContext } from "../context/SongProvider";
import { navigation } from "../types/RootStackParamList";
import { useSelector } from "react-redux";

import { RootState } from "../redux/store";
import useSound from "../hooks/useSound";
import { Song } from "../types/song";
import { db } from "../firebase";
import usePlayerAnimation from "../hooks/usePlayerAnimation";

const { width: SCREEN_WIDTH } = Dimensions.get("screen");
interface IMusciPayerProp {
    navigation: navigation<"HomeTab">;
}

const MusicPlayer: React.FC<IMusciPayerProp> = ({ navigation }) => {
    const progress = useRef<number>(0);

    const musicState = useSelector((state: RootState) => state.song.musicState);

    const currentSong = useSelector(
        (state: RootState) => state.song.currentSong
    );

    const { ListFavourite } = useSongContext();

    const [joeColor, setJoeColor] = useState("ccc");

    const { sound, onPlayPause } = useSound();

    const [isLiked, setIsLiked] = useState(
        ListFavourite.some((s: any) => s.key == currentSong.key)
    );

    const addToLikedList = async (likedSong: Song) => {
        setIsLiked(!isLiked);
        try {
            const docRef = db.doc(
                db.getFirestore(),
                "likedList",
                currentSong.key
            );
            if (ListFavourite.some((s: any) => s.key == likedSong.key)) {
                await db.deleteDoc(docRef);
            } else {
                await db.setDoc(docRef, likedSong);
            }
        } catch (err: any) {
            console.log(err.message);
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
        progress.current = (musicState.position / musicState.duration) * 100;
        return progress.current;
    };

    React.useEffect(() => {
        setJoeColor(currentSong?.images?.joecolor?.split(":")?.[5]);
    }, [currentSong]);

    React.useEffect(() => {
        setIsLiked(ListFavourite.some((s: Song) => s.key == currentSong.key));
    }, [currentSong.key, ListFavourite]);

    const { playerAnimation } = usePlayerAnimation();

    const memo = React.useMemo(() => playerAnimation, []);

    const translateX = memo.interpolate({
        inputRange: [40, 45, 50],
        outputRange: [150, 50, 0],
    });

    const opacity = memo.interpolate({
        inputRange: [40, 45, 50],
        outputRange: [0, 0.3, 1],
    });

    return (
        <Animated.View
            style={{
                bottom: memo,
                zIndex: 1,
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
                style={{
                    backgroundColor: `#${joeColor}`,
                }}
                className="flex-col rounded-lg justify-center w-[100%] h-[100%]"
            >
                <View className="flex-row justify-between items-center">
                    <View>
                        <Image
                            source={{
                                uri: currentSong?.images?.coverart,
                            }}
                            className="object-cover w-10 h-10 rounded-lg ml-[7px] z-50"
                        />
                    </View>
                    <View style={{ marginLeft: 10, maxWidth: "60%" }}>
                        <Animated.Text
                            numberOfLines={1}
                            style={{
                                transform: [{ translateX }],
                                opacity,
                            }}
                            className="text-white font-semibold "
                        >
                            {currentSong?.title}
                        </Animated.Text>
                        <Animated.Text
                            style={{
                                color: "#fff",
                                transform: [{ translateX }],
                                opacity,
                            }}
                            numberOfLines={1}
                        >
                            {currentSong?.subtitle}
                        </Animated.Text>
                    </View>
                    <View className="ml-auto flex-row items-center justify-between">
                        <TouchableOpacity>
                            <AntDesign
                                onPress={() => addToLikedList(currentSong)}
                                name={isLiked ? "heart" : "hearto"}
                                size={24}
                                color={isLiked ? "#13d670" : "#fff"}
                                style={{ marginRight: 15 }}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                onPlayPause();
                            }}
                        >
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
                <View
                    style={{
                        backgroundColor: "rgba(255,255,255,0.5)",
                        borderRadius: 2,
                    }}
                    className="h-[2px] mt-0 max-w-[100%] relative bottom-[-4px] mx-[8px]"
                >
                    <View
                        style={{
                            borderRadius: 2,
                            width: `${getProgress()}%`,
                        }}
                        className="h-[2px] bg-[#fff] max-w-[100%] absolute"
                    />
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};
export default React.memo(MusicPlayer);
