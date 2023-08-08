import { TouchableOpacity } from "react-native";
import React, { useMemo } from "react";
import useSound from "../../../hooks/useSound";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Entypo } from "@expo/vector-icons";

const PlayControl = () => {
    const { onPlayPause } = useSound();
    const musicState = useSelector((state: RootState) => state.song.musicState);

    return (
        <TouchableOpacity
            onPress={onPlayPause}
            className="w-[60px] h-[60px] rounded-full bg-white justify-center items-center"
        >
            <Entypo
                name={
                    !musicState.isPlaying
                        ? "controller-play"
                        : "controller-paus"
                }
                size={36}
                color="#000"
            />
        </TouchableOpacity>
    );
};

export default React.memo(PlayControl);
