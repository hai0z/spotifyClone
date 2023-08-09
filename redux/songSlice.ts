import { ISong } from "./../types/song";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ISongSlice {
    position: number;
    duration: number;
}
export interface IPlayFrom {
    from: "album" | "library" | "search" | "related";
    name: string;
}
interface ISongState {
    musicState: ISongSlice;
    currentSong: ISong;
    playFrom: IPlayFrom;
    isLooping: boolean;
    isShuffle: boolean;
    listFavorite: ISong[];
    songLoaded: boolean;
    currenLineLyricSynced: number;
    isPlay: boolean;
}
const initialState: ISongState = {
    musicState: {
        position: 0,
        duration: 0,
    },
    currentSong: {} as ISong,
    playFrom: {
        from: "library",
        name: "Bài hát đã thích",
    },
    isLooping: false,
    isShuffle: false,
    listFavorite: [],
    songLoaded: true,
    currenLineLyricSynced: 0.1,
    isPlay: false,
};
const songSlice = createSlice({
    name: "song",
    initialState,
    reducers: {
        updateSongState: (state, action) => {
            state.musicState = {
                position: action.payload.position,
                duration: action.payload.duration,
            };
        },
        setCurrentSong: (state, action: PayloadAction<ISong>) => {
            state.currentSong = action.payload;
        },
        setLooping: (state, action: PayloadAction<boolean>) => {
            state.isLooping = action.payload;
        },
        setShuffle: (state, action: PayloadAction<boolean>) => {
            state.isShuffle = action.payload;
        },
        setListFavourite: (state, action: PayloadAction<ISong[]>) => {
            state.listFavorite = action.payload;
        },
        setSongLoaded: (state, action: PayloadAction<boolean>) => {
            state.songLoaded = action.payload;
        },
        setCurrentLineLyricSynced: (state, action: PayloadAction<number>) => {
            state.currenLineLyricSynced = action.payload;
        },
        setIsPlay: (state, action: PayloadAction<boolean>) => {
            state.isPlay = action.payload;
        },
    },
});
export const {
    updateSongState,
    setCurrentSong,
    setListFavourite,
    setLooping,
    setShuffle,
    setSongLoaded,
    setCurrentLineLyricSynced,
    setIsPlay,
} = songSlice.actions;
export default songSlice.reducer;
