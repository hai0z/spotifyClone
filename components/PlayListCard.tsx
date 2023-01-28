import { Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { navigation } from "../types/RootStackParamList";
import { Song } from "../types/song";
import { useDispatch } from "react-redux";
import { setCurrentSong, setPlaying } from "../redux/songSlice";

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
    const handleClick = () => {
        if (type === "artist") {
            return;
        } else {
            displayAnimation();
            dispatch(setCurrentSong(playList));
            dispatch(
                setPlaying({
                    isPlaying: true,
                    playFrom: {
                        from: "likedList",
                        name: "bài hát đã thích",
                    },
                })
            );
        }
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
                    style={{
                        fontWeight: "bold",
                        color: "#fff",
                        fontSize: 12,
                        marginTop: 3,
                    }}
                >
                    {type == "artist" ? playList.subtitle : playList.title}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export default React.memo(PlayListCard);
