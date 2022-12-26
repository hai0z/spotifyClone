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
    },
});
export const { updateSongState } = songSlice.actions;
export default songSlice.reducer;
