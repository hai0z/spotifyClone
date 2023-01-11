import { Text, View, Image, TouchableOpacity } from "react-native";
import React, { useRef, useState } from "react";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useSongContext } from "../context/SongProvider";
import { navigation } from "../types/RootStackParamList";
import { useSelector } from "react-redux";

import { RootState } from "../redux/store";
import useSound from "../hooks/useSound";
import { Song } from "../types/song";
import { db } from "../firebase";

interface IMusciPayerProp {
    navigation: navigation<"HomeTab">;
}

const MusicPlayer: React.FC<IMusciPayerProp> = ({ navigation }) => {
    const progress = useRef<number>(0);

    const musicState = useSelector((state: RootState) => state.song.musicState);

    const currentSong = useSelector(
        (state: RootState) => state.song.currentSong
    );

    const { ListFavourite } = useSongContext();

    const [joeColor, setJoeColor] = useState("ccc");

    const { sound, onPlayPause } = useSound();

    const [isLiked, setIsLiked] = useState(
        ListFavourite.some((s: any) => s.key == currentSong.key)
    );

    const addToLikedList = async (likedSong: Song) => {
        setIsLiked(!isLiked);
        try {
            const docRef = db.doc(
                db.getFirestore(),
                "likedList",
                currentSong.key
            );
            const docSnap = await db.getDoc(docRef);
            if (docSnap.exists()) {
                await db.deleteDoc(docRef);
            } else {
                await db.setDoc(docRef, likedSong);
            }
        } catch (err: any) {
            console.log(err.message);
        }
    };

    const getProgress = () => {
        if (
            musicState.position == null ||
            musicState.duration == null ||
            sound == null
        ) {
            return 0;
        }
        progress.current = (musicState.position / musicState.duration) * 100;
        return progress.current;
    };

    React.useEffect(() => {
        setJoeColor(currentSong?.images?.joecolor?.split(":")?.[5]);
    }, [currentSong]);

    React.useEffect(() => {
        setIsLiked(ListFavourite.some((s: any) => s.key == currentSong.key));
    }, [currentSong.key, ListFavourite]);

    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
                navigation.navigate("MusicPlayer");
            }}
            style={{
                position: "absolute",
                width: "100%",
                height: 60,
                bottom: 50,
                backgroundColor: `#${joeColor}`,
                flexDirection: "column",
                borderRadius: 10,
                justifyContent: "center",
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <View>
                    <Image
                        source={{
                            uri: currentSong?.images?.coverart,
                        }}
                        style={{
                            resizeMode: "cover",
                            width: 50,
                            height: 50,
                            borderRadius: 7,
                            marginLeft: 7,
                            zIndex: 1111,
                        }}
                    />
                </View>
                <View style={{ marginLeft: 10, maxWidth: "60%" }}>
                    <Text
                        numberOfLines={1}
                        style={{
                            color: "#fff",
                            fontWeight: "600",
                        }}
                    >
                        {currentSong?.title}
                    </Text>
                    <Text style={{ color: "#fff" }} numberOfLines={1}>
                        {currentSong?.subtitle}
                    </Text>
                </View>
                <View
                    style={{
                        marginLeft: "auto",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <TouchableOpacity>
                        <AntDesign
                            onPress={() => addToLikedList(currentSong)}
                            name={isLiked ? "heart" : "hearto"}
                            size={24}
                            color={isLiked ? "#13d670" : "#fff"}
                            style={{ marginRight: 15 }}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onPlayPause()}>
                        <Entypo
                            name={
                                !musicState.isPlaying
                                    ? "controller-play"
                                    : "controller-paus"
                            }
                            size={30}
                            color="#fff"
                            style={{ marginRight: 15 }}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <View
                style={{
                    height: 2,
                    marginTop: 2,
                    backgroundColor: "rgba(255,255,255,0.5)",
                    marginHorizontal: 8,
                    maxWidth: "100%",
                    position: "relative",
                }}
            >
                <View
                    style={{
                        height: 2,
                        backgroundColor: "#fff",
                        maxWidth: "100%",
                        position: "absolute",
                        width: `${getProgress()}%`,
                    }}
                />
            </View>
        </TouchableOpacity>
    );
};
export default MusicPlayer;
