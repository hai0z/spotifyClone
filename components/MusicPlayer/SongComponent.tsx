import { Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Song } from "../../types/song";

interface ISongComponentProps {
    song: Song & any;
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
                <Text
                    className="text-[15px] text-white font-semibold "
                    numberOfLines={1}
                >
                    {song.title}
                </Text>

                <View className="flex-row items-center">
                    {!!song?.sections?.[1].text && (
                        <View className="w-8 bg-[#818181] justify-center items-center  mr-1 flex rounded-md">
                            <Text className="text-xs font-bold text-[10px]">
                                Lyric
                            </Text>
                        </View>
                    )}
                    <Text className="text-[#818181] text-[13px] font-medium">
                        {song.subtitle}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default SongComponent;
