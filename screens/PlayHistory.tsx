import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { navigation } from "../types/RootStackParamList";
import { db } from "../firebase";
import { ISong, Song } from "../types/song";
import { FlashList } from "@shopify/flash-list";
import { useDispatch } from "react-redux";
import usePlayerAnimation from "../hooks/usePlayerAnimation";
import { setCurrentSong, setIsPlay } from "../redux/songSlice";

interface ISongCardProps {
    item: ISong;
    onPress: (song: ISong) => void;
}

const SongCard = ({ item, onPress }: ISongCardProps) => {
    return (
        <TouchableOpacity
            onPress={() => onPress(item)}
            className="flex-row items-center pt-[15px] pl-[15px]"
        >
            <Image
                source={{ uri: item?.thumbnails?.[0]?.url }}
                className="h-[50px] w-[50px] "
            />
            <View className="justify-center ml-[10px] max-w-[80%]">
                <Text className="text-white" numberOfLines={1}>
                    {item.title}
                </Text>

                <Text className="text-white">{item.artists?.[0]?.name}</Text>
            </View>
        </TouchableOpacity>
    );
};
const PlayHistory = () => {
    const navigation = useNavigation<navigation<"HomeTab">>();

    const handlePress = () => {
        navigation.goBack();
    };

    const [history, setHistory] = useState<ISong[]>([]);

    const { displayAnimation } = usePlayerAnimation();
    const dispatch = useDispatch();

    const getHistory = async () => {
        const song: ISong[] = [];
        const q = db.query(
            db.collection(db.getFirestore(), "playHistory"),
            db.orderBy("time", "desc"),
            db.limit(30)
        );
        const querySnapshot = await db.getDocs(q);
        querySnapshot.forEach((doc) => {
            song.push(doc.data() as ISong);
        });
        setHistory(song);
    };

    useEffect(() => {
        getHistory();
    }, []);

    const onPress = useCallback((song: ISong) => {
        displayAnimation();
        dispatch(setIsPlay(true));
        dispatch(setCurrentSong(song));
    }, []);

    console.log("history screen");
    return (
        <View className="flex-1 bg-[#121212] pt-10">
            <View className="flex-row px-4">
                <TouchableOpacity onPress={handlePress}>
                    <AntDesign name="arrowleft" size={24} color="#fff" />
                </TouchableOpacity>
                <Text className="text-white font-bold text-[20px] pl-20">
                    Mới phát gần đây
                </Text>
            </View>
            <FlashList
                contentContainerStyle={{ paddingBottom: 150 }}
                className="pt-4"
                data={history}
                estimatedItemSize={65}
                renderItem={({ item }) => (
                    <SongCard item={item} onPress={onPress} />
                )}
            />
        </View>
    );
};

export default PlayHistory;
