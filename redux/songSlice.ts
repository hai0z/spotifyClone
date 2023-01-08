import { createSlice } from "@reduxjs/toolkit";

export interface ISongSlice {
    isPlaying: boolean;
    position: number;
    duration: number;
}

const songSlice = createSlice({
    name: "song",
    initialState: {
        musicState: {} as ISongSlice,
    },
    reducers: {
        updateSongState: (state, action) => {
            state.musicState = {
                isPlaying: action.payload.isPlaying,
                position: action.payload.position,
                duration: action.payload.duration,
            };
        },
        setPlaying: (state) => {
            state.musicState = {
                ...state.musicState,
                isPlaying: true,
            };
        },
    },
});
export const { updateSongState, setPlaying } = songSlice.actions;
export default songSlice.reducer;
