import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
    Audio,
    AVPlaybackStatusSuccess,
    InterruptionModeAndroid,
} from "expo-av";
import { Sound } from "expo-av/build/Audio";
import { useSongContext } from "../context/SongProvider";
import { RootState } from "../redux/store";
import { setCurrentSong, updateSongState } from "../redux/songSlice";
import React, { createContext } from "react";
import { Song } from "../types/song";
interface IPlayerContext {
    sound: any;
    setSound: any;
    onPlaybackStatusUpdate: any;
    playSound: any;
    onPlayPause: any;
    playFromPosition: any;
    // playerAnimation: Animated.Value;
    // displayAnimation: () => void;
}

export const PlayerContext = createContext<IPlayerContext>(
    {} as IPlayerContext
);

function PlayerProvider({ children }: { children: React.ReactNode }) {
    const [sound, setSound] = React.useState<Sound | null>(null);

    const { nextSong, isLooping, ListFavourite } = useSongContext();

    const dispatch = useDispatch();

    const musicState = useSelector((state: RootState) => state.song.musicState);
    const playFrom = useSelector((state: RootState) => state.song.playFrom);

    const currentSong = useSelector(
        (state: RootState) => state.song.currentSong
    );
    const onPlaybackStatusUpdate = (status: AVPlaybackStatusSuccess) => {
        if (status.didJustFinish && !status.isLooping) {
            if (playFrom == "likedList") {
                const currentSongIndex: number = ListFavourite.findIndex(
                    (e: Song) => e.key == currentSong.key
                );
                if (currentSongIndex == ListFavourite.length - 1) {
                    dispatch(setCurrentSong(ListFavourite[0]));
                } else {
                    dispatch(
                        setCurrentSong(ListFavourite[currentSongIndex + 1])
                    );
                }
            }
        }
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
                    isLooping,
                    progressUpdateIntervalMillis: 150,
                },
                onPlaybackStatusUpdate as any
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
    async function playFromPosition(position: number) {
        if (!sound) return;
        if (musicState.isPlaying) {
            await sound
                .playFromPositionAsync(position)
                .catch((err) => console.log(err));
        } else {
            await sound
                .setPositionAsync(position)
                .catch((err) => console.log(err));
        }
    }
    React.useEffect(() => {
        playSound();
    }, [currentSong]);

    React.useEffect(() => {
        return sound
            ? () => {
                  sound.unloadAsync();
              }
            : undefined;
    }, [sound]);
    React.useEffect(() => {
        Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            staysActiveInBackground: true,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            playThroughEarpieceAndroid: false,
            interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
        });
    }, []);
    return (
        <PlayerContext.Provider
            value={{
                sound,
                onPlayPause,
                onPlaybackStatusUpdate,
                playSound,
                setSound,
                playFromPosition,
            }}
        >
            {children}
        </PlayerContext.Provider>
    );
}

export default PlayerProvider;
