import {
    StyleSheet,
    Text,
    Dimensions,
    Image,
    TouchableOpacity,
} from "react-native";
import React from "react";
import { ISong } from "../../types/song";
import { useDispatch } from "react-redux";
import {
    setCurrentSong,
    setIsPlay,
    setSongLoaded,
} from "../../redux/songSlice";
import { getAudioUrl } from "../../services/youtube";
const { width: SCREEN_WITH } = Dimensions.get("screen");

interface IMiniCardProps {
    song: ISong;
    displayAnimation: () => void;
}
const MiniPlayCard: React.FC<IMiniCardProps> = ({ song, displayAnimation }) => {
    const dispatch = useDispatch();

    const handleClick = async () => {
        dispatch(setIsPlay(true));
        dispatch(setSongLoaded(false));
        const url = await getAudioUrl(song.videoId);
        dispatch(setCurrentSong({ ...song, audioUrl: url }));
        dispatch(setSongLoaded(true));
        displayAnimation();
    };

    return (
        <TouchableOpacity
            style={styles.container}
            activeOpacity={0.9}
            onPress={handleClick}
        >
            <Image
                style={styles.songImg}
                source={{
                    uri: song?.thumbnails?.[0]?.url,
                }}
            />
            <Text style={styles?.songTitle} numberOfLines={2}>
                {song?.title}
            </Text>
        </TouchableOpacity>
    );
};

export default React.memo(MiniPlayCard);

const styles = StyleSheet.create({
    container: {
        width: SCREEN_WITH / 2 - 15,
        backgroundColor: "#2a2a2a",
        height: 55,
        borderRadius: 5,
        flexDirection: "row",
        alignItems: "center",
        marginTop: 7,
    },
    songImg: {
        width: 55,
        height: 55,
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
    },
    songTitle: {
        color: "#fff",
        fontWeight: "bold",
        marginLeft: 10,
        paddingRight: 10,
        width: "70%",
    },
});
