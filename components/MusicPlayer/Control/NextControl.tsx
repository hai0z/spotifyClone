import { TouchableOpacity } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { useSongContext } from "../../../context/SongProvider";
import { Song } from "../../../types/song";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { setCurrentSong } from "../../../redux/songSlice";

const NextControl = () => {
    const { isShuffle, ListFavourite } = useSongContext();

    const currentSong = useSelector(
        (state: RootState) => state.song.currentSong
    );
    const dispatch = useDispatch();
    const currentSongIndex = ListFavourite.findIndex(
        (s: Song) => s.key === currentSong.key
    );
    const handleNextSong = () => {
        if (!isShuffle) {
            if (currentSongIndex === ListFavourite.length - 1) {
                dispatch(setCurrentSong(ListFavourite[0]));
            } else {
                dispatch(setCurrentSong(ListFavourite[currentSongIndex + 1]));
            }
        } else {
            dispatch(
                setCurrentSong(
                    ListFavourite[
                        Math.floor(Math.random() * ListFavourite.length)
                    ]
                )
            );
        }
    };
    return (
        <TouchableOpacity
            onPress={handleNextSong}
            className="w-[60px] h-[60px] items-center justify-center"
        >
            <AntDesign name="stepforward" size={32} color="white" />
        </TouchableOpacity>
    );
};

export default NextControl;
