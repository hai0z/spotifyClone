import { TouchableOpacity } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { useSongContext } from "../../../context/SongProvider";
import { Song } from "../../../types/song";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { setCurrentSong } from "../../../redux/songSlice";

const PreviousControl = () => {
    const currentSong = useSelector(
        (state: RootState) => state.song.currentSong
    );
    const { ListFavourite } = useSongContext();
    const dispatch = useDispatch();

    const currentSongIndex = ListFavourite.findIndex(
        (s: Song) => s.key === currentSong.key
    );
    const handlePrevSong = () => {
        currentSongIndex != 0 &&
            dispatch(setCurrentSong(ListFavourite[currentSongIndex - 1]));
    };
    return (
        <TouchableOpacity
            className="w-[60px] h-[60px] items-center justify-center"
            onPress={handlePrevSong}
        >
            <AntDesign name="stepbackward" size={32} color="white" />
        </TouchableOpacity>
    );
};

export default PreviousControl;
