import { useSelector, useDispatch } from "react-redux";
import {
    Audio,
    AVPlaybackStatusError,
    AVPlaybackStatusSuccess,
    InterruptionModeAndroid,
} from "expo-av";
import { Sound } from "expo-av/build/Audio";
import { useSongContext } from "../context/SongProvider";
import { RootState } from "../redux/store";
import { setCurrentSong, updateSongState } from "../redux/songSlice";
import React, { createContext } from "react";
import { ISong } from "../types/song";
interface IPlayerContext {
    sound: Sound | null;
    setSound: React.Dispatch<React.SetStateAction<Sound | null>>;
    onPlaybackStatusUpdate: (status: AVPlaybackStatusSuccess) => void;
    playSound: () => Promise<void>;
    onPlayPause: () => Promise<void>;
    playFromPosition: (position: number) => Promise<void>;
    updateLoopingStatus: (isLooping: boolean) => Promise<void>;
}

export const PlayerContext = createContext<IPlayerContext>(
    {} as IPlayerContext
);

function PlayerProvider({ children }: { children: React.ReactNode }) {
    const [sound, setSound] = React.useState<Sound | null>(null);

    const { isLooping, ListFavourite } = useSongContext();

    const dispatch = useDispatch();

    const musicState = useSelector((state: RootState) => state.song.musicState);
    const playFrom = useSelector((state: RootState) => state.song.playFrom);

    const currentSong = useSelector(
        (state: RootState) => state.song.currentSong
    );
    const onPlaybackStatusUpdate = (status: AVPlaybackStatusSuccess) => {
        if (status.didJustFinish && !status.isLooping) {
            if (playFrom.from == "library") {
                const currentSongIndex: number = ListFavourite.findIndex(
                    (e: ISong) => e.videoId == currentSong.videoId
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
                    uri: currentSong.audioUrl,
                },
                {
                    shouldPlay: musicState.isPlaying,
                    isLooping,
                    progressUpdateIntervalMillis: 500,
                    volume: 1,
                },
                onPlaybackStatusUpdate as AVPlaybackStatusSuccess &
                    AVPlaybackStatusError
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
            await sound.setPositionAsync(Math.floor(position));
        } else {
            await sound
                .setPositionAsync(position)
                .catch((err) => console.log(err));
        }
    }
    async function updateLoopingStatus(isLooping: boolean) {
        await sound?.setStatusAsync({
            isLooping,
        });
    }

    React.useEffect(() => {
        playSound();
    }, [currentSong?.videoId]);

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

    const defaultValue = {
        sound,
        onPlayPause,
        onPlaybackStatusUpdate,
        playSound,
        setSound,
        playFromPosition,
        updateLoopingStatus,
    };
    return (
        <PlayerContext.Provider value={defaultValue}>
            {children}
        </PlayerContext.Provider>
    );
}

export default PlayerProvider;
