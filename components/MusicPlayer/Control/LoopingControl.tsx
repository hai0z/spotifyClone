import { TouchableOpacity, View } from "react-native";
import React from "react";
import { SimpleLineIcons } from "@expo/vector-icons";
import { useSongContext } from "../../../context/SongProvider";
import useSound from "../../../hooks/useSound";
import { useDispatch } from "react-redux";
import { setLooping } from "../../../redux/songSlice";

const LoopingControl = ({ size = 24 }: { size?: number }) => {
    const { isLooping } = useSongContext();
    const dispatch = useDispatch();
    const { updateLoopingStatus } = useSound();

    const handleLooping = () => {
        dispatch(setLooping(!isLooping));
        updateLoopingStatus(!isLooping);
    };
    return (
        <TouchableOpacity
            className="w-[60px] h-[60px] items-center justify-center"
            onPress={handleLooping}
        >
            <SimpleLineIcons
                name="loop"
                size={size}
                color={isLooping ? "#13d670" : "white"}
            />
            {isLooping && (
                <View className="absolute h-1 w-1 rounded-full bottom-[14] bg-[#13d670]" />
            )}
        </TouchableOpacity>
    );
};

export default LoopingControl;
