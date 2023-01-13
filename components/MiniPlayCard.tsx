import {
    StyleSheet,
    Text,
    Dimensions,
    Image,
    TouchableOpacity,
} from "react-native";
import React from "react";
import { Song } from "../types/song";
import { useDispatch } from "react-redux";
import { setCurrentSong, setPlaying } from "../redux/songSlice";
const { width: SCREEN_WITH } = Dimensions.get("screen");

const MiniPlayCard = ({
    song,
    displayAnimation,
}: {
    song: Song;
    displayAnimation: () => void;
}) => {
    const dispatch = useDispatch();
    console.log("playlistcardMini-rerender");
    return (
        <TouchableOpacity
            style={styles.container}
            activeOpacity={0.9}
            onPress={() => {
                displayAnimation();
                dispatch(setCurrentSong(song));
                dispatch(
                    setPlaying({
                        isPlaying: true,
                        playFrom: "other",
                    })
                );
            }}
        >
            <Image
                style={styles.songImg}
                source={{
                    uri: song?.images?.coverart,
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
