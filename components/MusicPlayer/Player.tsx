import { View, Dimensions } from "react-native";
import React from "react";

import PreviousControl from "./Control/PreviousControl";
import PlayControl from "./Control/PlayControl";
import LoopingControl from "./Control/LoopingControl";
import NextControl from "./Control/NextControl";
import ShuffleConrol from "./Control/ShuffleConrol";
import MusicSlider from "./Control/MusicSlider";

const { width: SCREEN_WIDTH } = Dimensions.get("screen");

const Player = () => {
    return (
        <View className="items-center mt-[15px]">
            <MusicSlider />
            <View
                style={{ width: SCREEN_WIDTH - 40 }}
                className="flex-row justify-between items-center mt-[5px]"
            >
                <ShuffleConrol size={28} />
                <PreviousControl />
                <PlayControl />
                <NextControl />
                <LoopingControl size={24} />
            </View>
        </View>
    );
};

export default React.memo(Player);
