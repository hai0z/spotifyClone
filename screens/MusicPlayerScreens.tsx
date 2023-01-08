import {
    Text,
    View,
    Image,
    Dimensions,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { Entypo } from "@expo/vector-icons";

import React, { useState } from "react";
import { route } from "../types/RootStackParamList";
import { LinearGradient } from "expo-linear-gradient";
import Slider from "@react-native-community/slider";
import axios, { AxiosError, AxiosResponse } from "axios";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";

const { width: SCREEN_WITH } = Dimensions.get("screen");

interface IMusciPayerProp {
    route: route<"MusicPlayer">;
}
interface ISongDetail {
    sections: any;
}
const MusicPlayerScreens = ({ route }: IMusciPayerProp) => {
    const { song } = route.params;

    const [songDetail, setSongDetail] = useState<ISongDetail>(
        {} as ISongDetail
    );
    const options = {
        method: "GET",
        url: "https://shazam-core.p.rapidapi.com/v1/tracks/details",
        params: { track_id: song.key },
        headers: {
            "X-RapidAPI-Key":
                "fcfe5a00eemshcaa5ba933a8931dp18407cjsn06329a84995b",
            "X-RapidAPI-Host": "shazam-core.p.rapidapi.com",
        },
    };
    React.useEffect(() => {
        axios
            .request(options)
            .then(function (response: AxiosResponse) {
                setSongDetail(response.data);
            })
            .catch(function (error: AxiosError) {
                console.error(error.message);
            });
    }, []);
    const musicState = useSelector((state: RootState) => state.song.musicState);

    let second: string | number = Math.floor((musicState.position / 1000) % 60);
    if (second < 10) {
        second = "0" + second;
    }
    const min = Math.floor((musicState.position / 1000 / 60) % 60);

    const totalTime = `${Math.floor(
        (musicState.duration / 1000 / 60) % 60
    )}:${Math.floor((musicState.duration / 1000) % 60)}`;
    return (
        <LinearGradient
            style={{ minWidth: "100%", minHeight: "100%", flex: 1 }}
            start={{ x: 0.4, y: 0.2 }}
            end={{ x: 0.6, y: 0.75 }}
            colors={[`#${song?.images.joecolor?.split(":")[5]}CE`, "gray"]}
        >
            <ScrollView>
                <View
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        paddingTop: 120,
                    }}
                >
                    <Image
                        source={{ uri: song?.images?.coverart }}
                        style={{
                            width: SCREEN_WITH - 80,
                            height: SCREEN_WITH - 80,
                        }}
                    />
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        paddingTop: 80,
                        justifyContent: "space-between",
                        marginHorizontal: 40,
                        alignItems: "center",
                    }}
                >
                    <View>
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: "bold",
                                color: "#fff",
                                textShadowColor: "#000",
                                textShadowOffset: { width: 0, height: 2 },
                                textShadowRadius: 1,
                                shadowOpacity: 0.2,
                            }}
                        >
                            {song?.title}
                        </Text>
                        <Text
                            style={{
                                fontSize: 13,
                                fontWeight: "bold",
                                color: "#fff",
                                textShadowColor: "#000",
                                textShadowOffset: { width: 0, height: 2 },
                                textShadowRadius: 1,
                                shadowOpacity: 0.2,
                            }}
                        >
                            {song?.subtitle}
                        </Text>
                    </View>
                    <Text>abc</Text>
                </View>
                <View style={{ alignItems: "center", marginTop: 15 }}>
                    <Slider
                        style={{
                            width: SCREEN_WITH - 40,
                            height: 40,
                        }}
                        minimumValue={0}
                        value={
                            (musicState.position / musicState.duration) * 100
                        }
                        maximumValue={100}
                        thumbTintColor="#ffffff"
                        minimumTrackTintColor="#FFd369"
                        maximumTrackTintColor="#000000"
                    />
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            width: SCREEN_WITH - 60,
                        }}
                    >
                        <Text
                            style={{
                                color: "rgba(255,255,255,0.5)",
                                fontWeight: "500",
                            }}
                        >
                            {min}:{second}
                        </Text>
                        <Text style={{ color: "#fff", fontWeight: "500" }}>
                            {totalTime}
                        </Text>
                    </View>
                    <View>
                        <TouchableOpacity
                            style={{
                                width: 80,
                                height: 80,
                                borderRadius: 40,
                                backgroundColor: "#fff",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Entypo
                                name={
                                    !musicState.isPlaying
                                        ? "controller-play"
                                        : "controller-paus"
                                }
                                size={40}
                                color="#000"
                            />
                        </TouchableOpacity>
                    </View>
                    <ScrollView
                        nestedScrollEnabled
                        contentContainerStyle={{
                            backgroundColor: `#${
                                song?.images.joecolor?.split(":")[5]
                            }CE`,
                            marginHorizontal: 20,
                            borderRadius: 10,
                            marginTop: 40,
                            zIndex: 1111,
                            padding: 10,
                        }}
                    >
                        {songDetail.sections?.[1].text?.map(
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
