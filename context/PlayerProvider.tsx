import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Audio, AVPlaybackStatusSuccess } from "expo-av";
import { Sound } from "expo-av/build/Audio";
import { useSongContext } from "../context/SongProvider";
import { RootState } from "../redux/store";
import { updateSongState } from "../redux/songSlice";
import React, { createContext } from "react";

interface IPlayerContext {
    sound: any;
    setSound: any;
    onPlaybackStatusUpdate: any;
    playSound: any;
    onPlayPause: any;
    playFromPosition: any;
}

export const PlayerContext = createContext<IPlayerContext>(
    {} as IPlayerContext
);

function PlayerProvider({ children }: { children: React.ReactNode }) {
    const [sound, setSound] = React.useState<Sound | null>(null);

    const { currentSong, setCurrentSong, nextSong, isLooping } =
        useSongContext();
    const dispatch = useDispatch();
    const musicState = useSelector((state: RootState) => state.song.musicState);

    const onPlaybackStatusUpdate = (status: AVPlaybackStatusSuccess) => {
        if (status.didJustFinish && !status.isLooping) {
            setCurrentSong(nextSong);
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
                    progressUpdateIntervalMillis: 200,
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
