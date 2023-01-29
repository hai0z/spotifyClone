import { View, Text, Dimensions } from "react-native";
import React from "react";
import Slider from "@react-native-community/slider";
import { useSelector } from "react-redux";
import useSound from "../../hooks/useSound";
import { RootState } from "../../redux/store";
import caculateTime from "../../utils/caculateMusicTime";
import PreviousControl from "./Control/PreviousControl";
import PlayControl from "./Control/PlayControl";
import LoopingControl from "./Control/LoopingControl";
import NextControl from "./Control/NextControl";
import ShuffleConrol from "./Control/ShuffleConrol";

const { width: SCREEN_WIDTH } = Dimensions.get("screen");

const Player = () => {
    const { playFromPosition } = useSound();
    const musicState = useSelector((state: RootState) => state.song.musicState);
    const time = caculateTime(musicState.duration, musicState.position);

    return (
        <View className="items-center mt-[15px]">
            <Slider
                step={0.15}
                style={{
                    width: SCREEN_WIDTH - 40,
                }}
                minimumValue={0}
                maximumValue={100}
                thumbTintColor="#ffffff"
                minimumTrackTintColor="#ffffff"
                maximumTrackTintColor="rgba(255,255,255,0.5)"
                onSlidingComplete={(value) => {
                    playFromPosition((musicState.duration * value) / 100);
                }}
                value={(musicState.position / musicState.duration) * 100 || 0}
            />
            <View
                style={{ width: SCREEN_WIDTH - 70 }}
                className={`flex-row justify-between`}
            >
                <Text className="text-stone-300 font-semibold text-[12px]">
                    {time.currentMin}:{time.currentSecond}
                </Text>
                <Text className="text-white font-semibold text-[12px]">
                    {time.totalTime}
                </Text>
            </View>
            <View
                style={{ width: SCREEN_WIDTH - 40 }}
                className="flex-row justify-between items-center mt-[5px]"
            >
                <ShuffleConrol />
                <PreviousControl />
                <PlayControl />
                <NextControl />
                <LoopingControl />
            </View>
        </View>
    );
};

export default React.memo(Player);
