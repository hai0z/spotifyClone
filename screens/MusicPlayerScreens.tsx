import {
    Text,
    View,
    Image,
    Dimensions,
    ScrollView,
    TouchableOpacity,
    NativeSyntheticEvent,
    NativeScrollEvent,
    StyleSheet,
} from "react-native";
import { Entypo, AntDesign } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import axios, { AxiosError, AxiosResponse } from "axios";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import { useSongContext } from "../context/SongProvider";
import { db } from "../firebase/index";
import useSound from "../hooks/useSound";
import { Song } from "../types/song";
import { useDispatch } from "react-redux";
import { setCurrentSong } from "../redux/songSlice";

const { width: SCREEN_WITH } = Dimensions.get("screen");

interface ISongDetail {
    sections: any;
}

const MusicPlayerScreens = () => {
    const { nextSong, isLooping, setIsLooping, ListFavourite } =
        useSongContext();

    const dispatch = useDispatch();

    const song = useSelector((state: RootState) => state.song.currentSong);
    const [isLiked, setIsLiked] = useState(
        ListFavourite.some((s: any) => s.key == song.key)
    );

    const [songDetail, setSongDetail] = useState<ISongDetail>(
        {} as ISongDetail
    );
    const options = {
        method: "GET",
        url: "https://shazam-core.p.rapidapi.com/v1/tracks/details",
        params: { track_id: song.key },
        headers: {
            "X-RapidAPI-Key":
                "25afd00c31msh690f22c6a3516c0p1799adjsn0eade0e56e0b",
            "X-RapidAPI-Host": "shazam-core.p.rapidapi.com",
        },
    };

    React.useEffect(() => {
        // axios
        //     .request(options)
        //     .then(function (response: AxiosResponse) {
        //         setSongDetail(response.data);
        //     })
        //     .catch(function (error: AxiosError) {
        //         console.error(error.message);
        //     });
    }, [song.key]);

    const musicState = useSelector((state: RootState) => state.song.musicState);
    const { onPlayPause, playFromPosition } = useSound();

    let second: string | number = Math.floor((musicState.position / 1000) % 60);
    if (second < 10) {
        second = "0" + second;
    }
    const min = Math.floor((musicState.position / 1000 / 60) % 60);

    const totalTime = `${Math.floor(
        (musicState.duration / 1000 / 60) % 60
    )}:${Math.floor((musicState.duration / 1000) % 60)}`;

    const handlePageChange = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offset = e.nativeEvent.contentOffset;
        if (offset) {
            const page = Math.round(offset.x / SCREEN_WITH) + 1;
            console.log(page);
            if (page) {
                // setCurrentSong(nextSong);
            }
        }
    };
    const addToLikedList = async (likedSong: Song) => {
        setIsLiked(!isLiked);
        try {
            const docRef = db.doc(db.getFirestore(), "likedList", song.key);
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
    useEffect(() => {
        setIsLiked(ListFavourite.some((s: any) => s.key == song.key));
    }, [song, ListFavourite]);

    return (
        <LinearGradient
            style={{ flex: 1 }}
            colors={[
                `#${song?.images?.joecolor?.split(":")[5]}CE`,
                "#000000ce",
            ]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
        >
            <ScrollView>
                <ScrollView
                    onMomentumScrollEnd={handlePageChange}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    contentContainerStyle={{
                        paddingTop: 125,
                    }}
                >
                    {[song, nextSong].map((src, index) => (
                        <Image
                            key={index}
                            source={{ uri: src?.images?.coverart }}
                            style={{
                                width: SCREEN_WITH,
                                height: SCREEN_WITH,
                                transform: [{ scale: 0.85 }],
                            }}
                        />
                    ))}
                </ScrollView>
                <View
                    style={{
                        flexDirection: "row",
                        paddingTop: 70,
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginHorizontal: 30,
                    }}
                >
                    <View>
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: "bold",
                                color: "#fff",
                            }}
                        >
                            {song?.title}
                        </Text>
                        <Text
                            style={{
                                fontSize: 13,
                                fontWeight: "500",
                                color: "#fff",
                            }}
                        >
                            {song?.subtitle}
                        </Text>
                    </View>
                    <TouchableOpacity onPress={() => addToLikedList(song)}>
                        <AntDesign
                            name={isLiked ? "heart" : "hearto"}
                            size={24}
                            color={isLiked ? "#13d670" : "#fff"}
                            style={{ marginRight: 5 }}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{ alignItems: "center", marginTop: 15 }}>
                    <Slider
                        style={{
                            width: SCREEN_WITH - 40,
                        }}
                        minimumValue={0}
                        value={
                            (musicState.position / musicState.duration) * 100 ||
                            0
                        }
                        maximumValue={100}
                        thumbTintColor="#ffffff"
                        minimumTrackTintColor="#ffffff"
                        maximumTrackTintColor="rgba(255,255,255,0.5)"
                        onSlidingComplete={(e) => {
                            playFromPosition((musicState.duration * e) / 100);
                        }}
                    />
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            width: SCREEN_WITH - 70,
                        }}
                    >
                        <Text
                            style={{
                                color: "rgba(255,255,255,0.5)",
                                fontWeight: "500",
                                fontSize: 12,
                            }}
                        >
                            {min}:{second}
                        </Text>
                        <Text
                            style={{
                                color: "#fff",
                                fontWeight: "500",
                                fontSize: 12,
                            }}
                        >
                            {totalTime}
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            width: SCREEN_WITH - 40,
                            alignItems: "center",
                            marginTop: 5,
                        }}
                    >
                        <TouchableOpacity style={styles.trackBtn}>
                            <FontAwesome
                                name="random"
                                size={24}
                                color="white"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.trackBtn}>
                            <AntDesign
                                name="stepbackward"
                                size={32}
                                color="white"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => onPlayPause()}
                            style={styles.playBtn}
                        >
                            <Entypo
                                name={
                                    !musicState.isPlaying
                                        ? "controller-play"
                                        : "controller-paus"
                                }
                                size={36}
                                color="#000"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => dispatch(setCurrentSong(nextSong))}
                            style={styles.trackBtn}
                        >
                            <AntDesign
                                name="stepforward"
                                size={32}
                                color="white"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.trackBtn}
                            onPress={() => setIsLooping(!isLooping)}
                        >
                            <SimpleLineIcons
                                name="loop"
                                size={24}
                                color={isLooping ? "#13d670" : "white"}
                            />
                        </TouchableOpacity>
                    </View>
                    <ScrollView
                        nestedScrollEnabled
                        contentContainerStyle={{
                            backgroundColor: `#${
                                song?.images?.joecolor?.split(":")[5]
                            }`,
                            marginHorizontal: 20,
                            borderRadius: 10,
                            marginTop: 40,
                            zIndex: 99,
                            padding: 10,
                        }}
                    >
                        {song.sections?.[1].text?.map(
                            (l: string, i: number) => (
                                <Text
                                    style={{
                                        color: "#ffff",
                                        fontSize: 18,
                                        fontWeight: "600",
                                    }}
                                    key={i}
                                >
                                    {l}
                                </Text>
                            )
                        )}
                    </ScrollView>
                </View>
            </ScrollView>
        </LinearGradient>
    );
};

export default MusicPlayerScreens;
const styles = StyleSheet.create({
    trackBtn: {
        width: 60,
        height: 60,
        justifyContent: "center",
        alignItems: "center",
    },
    playBtn: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
    },
});
