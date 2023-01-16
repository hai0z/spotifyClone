import { Text, View, Image, TouchableOpacity } from "react-native";
import React, { memo } from "react";
import { Song } from "../../types/song";

interface ISongComponentProps {
    song: Song;
    playSong: (song: Song) => void;
    displayAnimation: () => void;
}
const SongComponent: React.FC<ISongComponentProps> = ({
    song,
    playSong,
    displayAnimation,
}) => {
    console.log("re-render-Songcomp1");

    return (
        <TouchableOpacity
            className="flex-row items-center pt-[15px] pl-[15px]"
            onPress={() => {
                displayAnimation();
                playSong(song);
            }}
        >
            <Image
                source={{ uri: song.images.coverart }}
                className="h-[50px] w-[50px] "
            />
            <View className="justify-center ml-[10px] max-w-[80%]">
                <Text className="text-white" numberOfLines={1}>
                    {song.title}
                </Text>

                <Text className="text-white">{song.subtitle}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default memo(SongComponent);
