import { Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { navigation } from "../../types/RootStackParamList";
import { Song } from "../../types/song";
import { useDispatch } from "react-redux";
import { IPlayFrom, setCurrentSong, setPlaying } from "../../redux/songSlice";

interface IPlayListProp {
    playList: Song;
    type?: "song" | "artist";
    navigation?: navigation<"HomeTab">;
    displayAnimation: () => void;
}

const PlayListCard: React.FC<IPlayListProp> = ({
    playList,
    type,
    displayAnimation,
}) => {
    console.log("playlistcard-rerender");

    const dispatch = useDispatch();

    const playFrom: IPlayFrom = {
        from: "library",
        name: "bài hát đã thích",
    };

    const handleClick = () => {
        if (type === "artist") return;
        displayAnimation();
        dispatch(setCurrentSong(playList));
        dispatch(
            setPlaying({
                isPlaying: true,
                playFrom,
            })
        );
    };

    return (
        <TouchableOpacity
            onPress={handleClick}
            activeOpacity={0.7}
            className="flex-1 flex-col ml-[15px]"
        >
            <Image
                source={{
                    uri:
                        type == "artist"
                            ? playList.images?.background
                            : playList.images?.coverart,
                }}
                style={{
                    width: 150,
                    height: 150,
                    resizeMode: "cover",
                }}
            />
            <View className="w-[150px] mt-2">
                <Text
                    numberOfLines={2}
                    className="font-semibold text-white text-[12px] mt-[3px]"
                >
                    {type == "artist" ? playList.subtitle : playList.title}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export default React.memo(PlayListCard);
