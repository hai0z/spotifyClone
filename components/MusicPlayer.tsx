import { Text, View, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { Sound } from "expo-av/build/Audio";
import { useSongContext } from "../context/SongProvider";
import { navigation } from "../types/RootStackParamList";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { updateSongState } from "../redux/songSlice";
import { RootState } from "../redux/store";

interface IMusciPayerProp {
    navigation: navigation<"HomeTab">;
}

const MusicPlayer: React.FC<IMusciPayerProp> = ({ navigation }) => {
    const [sound, setSound] = React.useState<Sound | null>(null);

    const musicState = useSelector((state: RootState) => state.song.musicState);

    const { currentSong } = useSongContext();

    const [joeColor, setJoeColor] = useState("ccc");

    const dispatch = useDispatch<AppDispatch>();

    const onPlaybackStatusUpdate = (status: any) => {
        if (status.isPlaying == null) {
            dispatch(
                updateSongState({
                    isPlaying: false,
                    position: null,
                    duration: null,
                })
            );
        } else {
            dispatch(
                updateSongState({
                    isPlaying: status.isPlaying,
                    duration: status.durationMillis,
                    position: status.positionMillis,
                })
            );
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
    async function playSound() {
        if (sound) {
            sound.unloadAsync();
        }
        try {
            const { sound: newSound } = await Audio.Sound.createAsync(
                {
                    uri: currentSong?.hub?.actions?.[1].uri,
                },
                {
                    shouldPlay: musicState.isPlaying,
                    isLooping: true,
                },
                onPlaybackStatusUpdate
            );
            setSound(newSound);
        } catch (err) {
            console.log(err);
        }
    }

    async function onPlayPause() {
        if (!sound) return;
        if (musicState.isPlaying) {
            await sound.pauseAsync().catch((err) => console.log(err));
        } else {
            await sound
                .playFromPositionAsync(musicState.position ?? 0)
                .catch((err) => console.log(err));
        }
    }

    React.useEffect(() => {
        playSound();
        setJoeColor(currentSong?.images?.joecolor?.split(":")?.[5]);
    }, [currentSong]);

    React.useEffect(() => {
        return sound
            ? () => {
                  sound.unloadAsync();
              }
            : undefined;
    }, [sound]);

    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
                navigation.navigate("MusicPlayer", {
                    song: currentSong,
                });
            }}
            style={{
                position: "absolute",
                width: "100%",
                height: 60,
                bottom: 50,
                backgroundColor: `#${joeColor}`,
                flexDirection: "column",
                borderRadius: 10,
                justifyContent: "center",
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <View>
                    <Image
                        source={{
                            uri: currentSong?.images?.coverart,
                        }}
                        style={{
                            resizeMode: "cover",
                            width: 50,
                            height: 50,
                            borderRadius: 7,
                            marginLeft: 7,
                            zIndex: 1111,
                        }}
                    />
                </View>
                <View style={{ marginLeft: 10, maxWidth: "60%" }}>
                    <Text
                        numberOfLines={1}
                        style={{
                            color: "#fff",
                            fontWeight: "600",
                        }}
                    >
                        {currentSong?.title}
                    </Text>
                    <Text style={{ color: "#fff" }} numberOfLines={1}>
                        {currentSong?.subtitle}
                    </Text>
                </View>
                <View
                    style={{
                        marginLeft: "auto",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <AntDesign
                        name="hearto"
                        size={24}
                        color="#fff"
                        style={{ marginRight: 15 }}
                    />
                    <TouchableOpacity onPress={() => onPlayPause()}>
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
                    height: 2,
                    marginTop: 2,
                    backgroundColor: "rgba(255,255,255,0.5)",
                    marginHorizontal: 4,
                    maxWidth: "100%",
                    borderRadius: 2,
                    position: "relative",
                }}
            >
                <View
                    style={{
                        height: 2,

                        backgroundColor: "#fff",
                        maxWidth: "100%",
                        borderRadius: 2,
                        position: "absolute",
                        width: `${getProgress()}%`,
                    }}
                />
            </View>
        </TouchableOpacity>
    );
};
export default MusicPlayer;
