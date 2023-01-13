import { Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { navigation } from "../types/RootStackParamList";
import { Song } from "../types/song";
import { useDispatch } from "react-redux";
import { setCurrentSong, setPlaying } from "../redux/songSlice";
type PlayList = {
    title: string;
    images: {
        background: string;
        coverart: string;
    };
    artists: {
        alias: string;
    }[];
};
interface IPlayListProp {
    playList: PlayList & Partial<Song>;
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
    return (
        <TouchableOpacity
            onPress={() => {
                if (type === "artist") {
                    return;
                } else {
                    displayAnimation();
                    dispatch(setCurrentSong(playList));
                    dispatch(
                        setPlaying({
                            isPlaying: true,
                            playFrom: "other",
                        })
                    );
                }
            }}
            activeOpacity={0.7}
            style={{
                marginLeft: 15,
                flex: 1,
                flexDirection: "column",
            }}
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
            <View style={{ width: 150 }}>
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
