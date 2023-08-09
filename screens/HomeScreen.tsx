import { StatusBar } from "expo-status-bar";
import {
    View,
    ScrollView,
    RefreshControl,
    ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import Header from "../components/Header/Header";
import { navigation } from "../types/RootStackParamList";
import MiniPlayCard from "../components/MusicCard/MiniPlayCard";
import { ISong } from "../types/song";
import usePlayerAnimation from "../hooks/usePlayerAnimation";
import { LinearGradient } from "expo-linear-gradient";
import { getPlayHistory } from "../services/firebaseService";
import useHeaderColor from "../hooks/useHeaderColor";
import QuickPick from "../components/Home/QuickPick";
import { HomeData } from "../types/home";
import musicService from "../services/musicService";
import axios from "axios";
import SkeletonLoading from "../components/Animations/SkeletonLoading";
interface IHomeProps {
    navigation: navigation<"HomeTab">;
}

export default function App({ navigation }: IHomeProps) {
    const [refreshing, setRefreshing] = React.useState(false);
    console.log("homer render");
    const [loading, setLoading] = React.useState(false);
    const [playHistory, setPlayHistory] = useState<ISong[]>([]);
    const [homeData, setHomeData] = useState<HomeData[]>([]);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getHistory();
        setRefreshing(false);
    }, []);
    React.useEffect(() => {
        const getHomeData = async () => {
            const res = await musicService.getHome();
            setHomeData(res);
            setLoading(false);
        };
        getHomeData();
        getHistory();
    }, []);

    const getHistory = async () => {
        const data = await getPlayHistory();
        setPlayHistory(data);
    };
    const headerColor = useHeaderColor();
    const { displayAnimation } = usePlayerAnimation();
    if (loading) {
        return (
            <View className="bg-black w-full h-full relative z-20 items-center justify-center">
                <ActivityIndicator size="large" color="mediumseagreen" />
            </View>
        );
    } else
        return (
            <ScrollView
                showsVerticalScrollIndicator={false}
                className="flex-1 bg-[#121212] relative "
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <StatusBar style="light" backgroundColor="#00000050" />
                <View className="relative -z-1">
                    <LinearGradient
                        className="w-full h-40"
                        colors={[headerColor, "#121212"]}
                        start={{ x: 0.4, y: 0.1 }}
                        end={{ x: 0.5, y: 0.75 }}
                    >
                        <Header />
                    </LinearGradient>
                </View>

                <ScrollView
                    className="z-10 -mt-12  flex-1"
                    contentContainerStyle={{
                        paddingBottom: 170,
                    }}
                >
                    <View className="mt-[10px] flex-wrap flex-row justify-between my-[10px] w-full px-[10px]">
                        {playHistory.map((song, index) => (
                            <MiniPlayCard
                                key={index}
                                song={song}
                                displayAnimation={displayAnimation}
                            />
                        ))}
                    </View>
                    <View className="mt-8" style={{ minHeight: 264 }}>
                        <QuickPick
                            quickPickData={homeData[0]}
                            title="Chọn nhanh đài phát"
                            subTitle="bắt đầu một đài phát"
                        />
                    </View>
                    <View className="mt-4" style={{ minHeight: 256 }}>
                        <QuickPick
                            quickPickData={homeData[1]}
                            title="Đang thịnh hành"
                        />
                    </View>
                </ScrollView>
            </ScrollView>
        );
}
