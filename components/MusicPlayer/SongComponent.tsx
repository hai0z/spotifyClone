import { Text, View, Image, TouchableOpacity } from "react-native";
import React, { memo, useMemo } from "react";
import { Song } from "../../types/song";

interface ISongComponentProps {
    song: Song & any;
    playSong: (song: Song) => void;
    displayAnimation: () => void;
    isSelected: boolean;
    onSelected: (id: string) => void;
}
const SongComponent: React.FC<ISongComponentProps> = ({
    song,
    playSong,
    displayAnimation,
    isSelected,
    onSelected,
}) => {
    console.log("re-render-Songcomp1");

    const bgColor = useMemo(
        () => (isSelected ? "mediumseagreen" : "white"),
        [isSelected]
    );
    console.log(isSelected);
    return (
        <TouchableOpacity
            className="flex-row items-center pt-[15px] pl-[15px]"
            onPress={() => {
                onSelected(song.key);
                displayAnimation();
                playSong(song);
            }}
        >
            <Image
                source={{ uri: song.images.coverart }}
                className="h-[50px] w-[50px] "
            />
            <View className="justify-center ml-[10px] max-w-[80%]">
                <Text
                    className="text-[15px] font-bold "
                    numberOfLines={1}
                    style={{ color: bgColor }}
                >
                    {song.title}
                </Text>

                <View className="flex-row items-center">
                    {!!song?.sections?.[1].text && (
                        <View className="w-8 bg-[#ffffff70] justify-center items-center  mr-1 flex rounded-md">
                            <Text className="text-xs font-bold text-[10px]">
                                Lyric
                            </Text>
                        </View>
                    )}
                    <Text className="text-[#ffffff70] text-[13px] font-medium">
                        {song.subtitle}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default memo(SongComponent);
