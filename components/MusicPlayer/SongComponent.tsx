import { Text, View, Image, TouchableOpacity } from "react-native";
import React, { memo } from "react";
import { Song } from "../../types/song";
import usePlayerAnimation from "../../hooks/usePlayerAnimation";

const SongComponent = ({
    song,
    playSong,
    displayAnimation,
}: {
    song: Song;
    playSong: (song: Song) => void;
    displayAnimation: () => void;
}) => {
    console.log("re-render-Songcomp1");

    return (
        <TouchableOpacity
            style={{
                flexDirection: "row",
                alignItems: "center",
                paddingLeft: 15,
                paddingTop: 15,
                elevation: 100,
            }}
            onPress={() => {
                displayAnimation();
                playSong(song);
            }}
        >
            <Image
                source={{ uri: song.images.coverart }}
                style={{
                    width: 50,
                    height: 50,
                    resizeMode: "cover",
                }}
            />
            <View
                style={{
                    justifyContent: "center",
                    marginLeft: 10,
                    maxWidth: "80%",
                }}
            >
                <Text
                    style={{
                        color: "#fff",
                    }}
                    numberOfLines={1}
                >
                    {song.title}
                </Text>

                <Text
                    style={{
                        color: "#fff",
                    }}
                >
                    {song.subtitle}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export default memo(SongComponent);
