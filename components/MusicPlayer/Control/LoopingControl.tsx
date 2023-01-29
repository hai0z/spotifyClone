import { TouchableOpacity } from "react-native";
import React from "react";
import { SimpleLineIcons } from "@expo/vector-icons";
import { useSongContext } from "../../../context/SongProvider";
import useSound from "../../../hooks/useSound";

const LoopingControl = () => {
    const { isLooping, setIsLooping } = useSongContext();

    const { updateLoopingStatus } = useSound();

    const handleLooping = () => {
        setIsLooping(!isLooping);
        updateLoopingStatus(!isLooping);
    };
    return (
        <TouchableOpacity
            className="w-[60px] h-[60px] items-center justify-center"
            onPress={handleLooping}
        >
            <SimpleLineIcons
                name="loop"
                size={24}
                color={isLooping ? "#13d670" : "white"}
            />
        </TouchableOpacity>
    );
};

export default LoopingControl;
