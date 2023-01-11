import { Song } from "./../types/song";
import { createSlice } from "@reduxjs/toolkit";

export interface ISongSlice {
    isPlaying: boolean;
    position: number;
    duration: number;
}

const songSlice = createSlice({
    name: "song",
    initialState: {
        musicState: {
            isPlaying: false,
            position: 0,
            duration: 0,
        } as ISongSlice,
        currentSong: {} as Song & any,
    },
    reducers: {
        updateSongState: (state, action) => {
            state.musicState = {
                isPlaying: action.payload.isPlaying,
                position: action.payload.position,
                duration: action.payload.duration,
            };
        },
        setPlaying: (state, action) => {
            state.musicState = {
                ...state.musicState,
                isPlaying: action.payload,
            };
        },
        setCurrentSong: (state, action) => {
            state.currentSong = action.payload;
        },
    },
});
export const { updateSongState, setPlaying, setCurrentSong } =
    songSlice.actions;
export default songSlice.reducer;
