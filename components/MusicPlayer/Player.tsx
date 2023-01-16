import {
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import React from "react";
import Slider from "@react-native-community/slider";
import {
    Entypo,
    SimpleLineIcons,
    AntDesign,
    FontAwesome,
} from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import useSound from "../../hooks/useSound";
import { RootState } from "../../redux/store";
import { Song } from "../../types/song";
import { useSongContext } from "../../context/SongProvider";
import { setCurrentSong } from "../../redux/songSlice";
const { width: SCREEN_WIDTH } = Dimensions.get("screen");

const Player = () => {
    console.log("player-rerender");
    const { isLooping, setIsLooping, ListFavourite } = useSongContext();

    const { playFromPosition, onPlayPause, updateLoopingStatus } = useSound();

    const dispatch = useDispatch();

    const musicState = useSelector((state: RootState) => state.song.musicState);

    const song = useSelector((state: RootState) => state.song.currentSong);

    const currentSongIndex = React.useMemo(
        () => ListFavourite.findIndex((s: Song) => s.key == song.key),
        [song.key]
    );

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

    return (
        <View className="items-center mt-[15px]">
            <Slider
                style={{
                    width: SCREEN_WIDTH - 40,
                }}
                minimumValue={0}
                maximumValue={100}
                thumbTintColor="#ffffff"
                minimumTrackTintColor="#ffffff"
                maximumTrackTintColor="rgba(255,255,255,0.5)"
                onSlidingComplete={(value) => {
                    playFromPosition(
                        Math.floor(musicState.duration * value) / 100
                    );
                }}
                value={
                    Math.floor(
                        (musicState.position / musicState.duration) * 100
                    ) || 0
                }
            />
            <View
                style={{ width: SCREEN_WIDTH - 70 }}
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
                style={{ width: SCREEN_WIDTH - 40 }}
                className="flex-row justify-between items-center mt-[5px]"
            >
                <TouchableOpacity style={styles.trackBtn}>
                    <FontAwesome name="random" size={24} color="white" />
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
                    <AntDesign name="stepbackward" size={32} color="white" />
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
                        if (currentSongIndex === ListFavourite.length - 1) {
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
                    <AntDesign name="stepforward" size={32} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.trackBtn}
                    onPress={() => {
                        setIsLooping(!isLooping);
                        updateLoopingStatus(!isLooping);
                    }}
                >
                    <SimpleLineIcons
                        name="loop"
                        size={24}
                        color={isLooping ? "#13d670" : "white"}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default React.memo(Player);

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
