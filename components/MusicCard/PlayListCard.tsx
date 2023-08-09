import { Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { navigation } from "../../types/RootStackParamList";
import { ISong } from "../../types/song";
import { useDispatch } from "react-redux";
import {
    IPlayFrom,
    setCurrentSong,
    setIsPlay,
    setSongLoaded,
} from "../../redux/songSlice";
import { Content } from "../../types/home";
import { getAudioUrl } from "../../services/youtube";

interface IPlayListProp {
    playList: Content & ISong;
    type?: "song" | "artist";
    navigation?: navigation<"HomeTab">;
    displayAnimation: () => void;
}

const PlayListCard: React.FC<IPlayListProp> = ({
    playList,
    type,
    displayAnimation,
}) => {
    const dispatch = useDispatch();

    const playFrom: IPlayFrom = {
        from: "library",
        name: "bài hát đã thích",
    };

    const handleClick = async () => {
        if (type === "artist") return;
        dispatch(setSongLoaded(false));
        dispatch(setIsPlay(true));
        const url = await getAudioUrl(playList.videoId);
        dispatch(setCurrentSong({ ...playList, audioUrl: url }));
        dispatch(setSongLoaded(true));
        displayAnimation();
    };

    return (
        <TouchableOpacity
            onPress={handleClick}
            activeOpacity={0.7}
            className="flex-col mx-1"
        >
            <Image
                source={{
                    uri: playList?.thumbnails?.[
                        playList?.thumbnails?.length - 1
                    ].url,
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
                    {type == "artist" ? playList?.title : playList?.title}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export default React.memo(PlayListCard);
