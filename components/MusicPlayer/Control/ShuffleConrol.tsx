import { TouchableOpacity, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useSongContext } from "../../../context/SongProvider";
import { useDispatch } from "react-redux";
import { setShuffle } from "../../../redux/songSlice";

const ShuffleConrol = () => {
    const { isShuffle } = useSongContext();
    const dispatch = useDispatch();

    return (
        <TouchableOpacity
            activeOpacity={1}
            className="w-[60px] h-[60px] items-center justify-center "
            onPress={() => dispatch(setShuffle(!isShuffle))}
        >
            <Ionicons
                name="shuffle"
                size={28}
                color={isShuffle ? "#13d670" : "white"}
            />
            {isShuffle && (
                <View className="absolute h-1 w-1 rounded-full bottom-[15] bg-[#13d670]" />
            )}
        </TouchableOpacity>
    );
};

export default ShuffleConrol;
