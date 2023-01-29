import {
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import React, { useCallback, useMemo } from "react";
import Slider from "@react-native-community/slider";
import {
    Entypo,
    SimpleLineIcons,
    AntDesign,
    Ionicons,
} from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import useSound from "../../hooks/useSound";
import { RootState } from "../../redux/store";
import { Song } from "../../types/song";
import { useSongContext } from "../../context/SongProvider";
import { setCurrentSong } from "../../redux/songSlice";
const { width: SCREEN_WIDTH } = Dimensions.get("screen");

interface IPlayerProps {
    playList: Song[];
}

const caculateTime = (duration: number, position: number) => {
    let second: string | number = Math.floor((position / 1000) % 60);

    if (second < 10) {
        second = "0" + second;
    }
    const min = Math.floor((position / 1000 / 60) % 60);

    let totalTimeSecond: string | number | any =
        Math.floor(duration / 1000) % 60;

    if (totalTimeSecond < 10) {
        totalTimeSecond = "0" + totalTimeSecond;
    }
    const totalTime = `${Math.floor(
        (duration / 1000 / 60) % 60
    )}:${totalTimeSecond}`;

    return {
        min,
        second,
        totalTime,
    };
};
const Player: React.FC<IPlayerProps> = ({ playList }) => {
    const { isLooping, setIsLooping, isShuffle, setIsShuffle } =
        useSongContext();

    const { playFromPosition, onPlayPause, updateLoopingStatus } = useSound();

    const dispatch = useDispatch();

    const musicState = useSelector((state: RootState) => state.song.musicState);

    const song = useSelector((state: RootState) => state.song.currentSong);

    const currentSongIndex = playList.findIndex((s: Song) => s.key == song.key);

    const time = caculateTime(musicState.duration, musicState.position);

    const handleNextSong = () => {
        if (!isShuffle) {
            if (currentSongIndex === playList.length - 1) {
                dispatch(setCurrentSong(playList[0]));
            } else {
                dispatch(setCurrentSong(playList[currentSongIndex + 1]));
            }
        } else {
            dispatch(
                setCurrentSong(
                    playList[Math.floor(Math.random() * playList.length)]
                )
            );
        }
    };
    const handleLooping = () => {
        setIsLooping(!isLooping);
        updateLoopingStatus(!isLooping);
    };

    const handlePrevSong = () => {
        currentSongIndex != 0 &&
            dispatch(setCurrentSong(playList[currentSongIndex - 1]));
    };
    return (
        <View className="items-center mt-[15px]">
            <Slider
                step={0.15}
                style={{
                    width: SCREEN_WIDTH - 40,
                }}
                minimumValue={0}
                maximumValue={100}
                thumbTintColor="#ffffff"
                minimumTrackTintColor="#ffffff"
                maximumTrackTintColor="rgba(255,255,255,0.5)"
                onSlidingComplete={(value) => {
                    playFromPosition((musicState.duration * value) / 100);
                }}
                value={(musicState.position / musicState.duration) * 100 || 0}
            />
            <View
                style={{ width: SCREEN_WIDTH - 70 }}
                className={`flex-row justify-between`}
            >
                <Text className="text-stone-300 font-semibold text-[12px]">
                    {time.min}:{time.second}
                </Text>
                <Text className="text-white font-semibold text-[12px]">
                    {time.totalTime}
                </Text>
            </View>
            <View
                style={{ width: SCREEN_WIDTH - 40 }}
                className="flex-row justify-between items-center mt-[5px]"
            >
                <TouchableOpacity
                    style={styles.trackBtn}
                    onPress={() => setIsShuffle(!isShuffle)}
                >
                    <Ionicons
                        name="shuffle"
                        size={28}
                        color={isShuffle ? "#13d670" : "white"}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.trackBtn}
                    onPress={handlePrevSong}
                >
                    <AntDesign name="stepbackward" size={32} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={onPlayPause} style={styles.playBtn}>
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
                    onPress={handleNextSong}
                    style={styles.trackBtn}
                >
                    <AntDesign name="stepforward" size={32} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.trackBtn}
                    onPress={handleLooping}
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
