import { Song } from "./../types/song";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ISongSlice {
    isPlaying: boolean;
    position: number;
    duration: number;
}
export interface IPlayFrom {
    from: "album" | "library" | "search" | "related";
    name: string;
}
interface ISongState {
    musicState: ISongSlice;
    currentSong: Song & { sections?: string[] | any[] };
    playFrom: IPlayFrom;
    isLooping: boolean;
    isShuffle: boolean;
    listFavorite: Song[];
}
const initialState: ISongState = {
    musicState: {
        isPlaying: false,
        position: 0,
        duration: 0,
    },
    currentSong: {} as Song & { sections?: string[] | any[] },
    playFrom: {
        from: "library",
        name: "Bài hát đã thích",
    },
    isLooping: false,
    isShuffle: false,
    listFavorite: [],
};
const songSlice = createSlice({
    name: "song",
    initialState,
    reducers: {
        updateSongState: (state, action) => {
            state.musicState = {
                isPlaying: action.payload.isPlaying,
                position: action.payload.position,
                duration: action.payload.duration,
            };
        },
        setPlaying: (
            state,
            action: PayloadAction<{
                isPlaying: boolean;
                playFrom: IPlayFrom;
            }>
        ) => {
            state.musicState = {
                ...state.musicState,
                isPlaying: action.payload.isPlaying,
            };
            state.playFrom = action.payload.playFrom;
        },
        setCurrentSong: (state, action: PayloadAction<Song>) => {
            state.currentSong = action.payload;
        },
        setLooping: (state, action: PayloadAction<boolean>) => {
            state.isLooping = action.payload;
        },
        setShuffle: (state, action: PayloadAction<boolean>) => {
            state.isShuffle = action.payload;
        },
        setListFavourite: (state, action: PayloadAction<Song[]>) => {
            state.listFavorite = action.payload;
        },
    },
});
export const {
    updateSongState,
    setPlaying,
    setCurrentSong,
    setListFavourite,
    setLooping,
    setShuffle,
} = songSlice.actions;
export default songSlice.reducer;
