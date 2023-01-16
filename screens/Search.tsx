import {
    Text,
    View,
    TextInput,
    ScrollView,
    Image,
    TouchableOpacity,
    KeyboardAvoidingView,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";
import axios, { AxiosResponse } from "axios";
import { Song } from "../types/song";
import { useDispatch } from "react-redux";
import { setCurrentSong, setPlaying } from "../redux/songSlice";

interface ISearchResultProps {
    data: Song;
    onPress: () => void;
}
const SearchResult: React.FC<ISearchResultProps> = ({ data, onPress }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                height: 50,
                marginTop: 20,
                flexDirection: "row",
            }}
        >
            <Image
                source={{ uri: data.images.coverart }}
                className="w-[50px] h-[50px] object-cover"
            />
            <View className="flex flex-col justify-between ml-[10px] w-full">
                <Text
                    className="text-white font-semibold capitalize max-w-[70%]"
                    numberOfLines={1}
                >
                    {data.title}
                </Text>
                <Text style={{ color: "#bdbdbd", fontWeight: "500" }}>
                    {data.subtitle}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const Search = () => {
    const [search, setSearch] = useState<string>("");

    const searchDebounce = useDebounce(search, 3000);

    const [searchData, setSearchData] = useState([] as any);

    const dispatch = useDispatch();
    const options = {
        method: "GET",
        url: "https://shazam-core.p.rapidapi.com/v1/search/multi",
        params: { query: `${search}`, search_type: "SONGS" },
        headers: {
            "X-RapidAPI-Key":
                "25afd00c31msh690f22c6a3516c0p1799adjsn0eade0e56e0b",
            "X-RapidAPI-Host": "shazam-core.p.rapidapi.com",
        },
    };

    const onPress = useCallback((song: Song) => {
        dispatch(setCurrentSong(song));
        dispatch(setPlaying({ isPlaying: true, playFrom: "other" }));
    }, []);

    useEffect(() => {
        const fethSearch = async () => {
            console.log(`searching...`);
            try {
                const { data }: AxiosResponse = await axios.request(options);
                console.log(data);
                setSearchData(
                    data.tracks.hits.map((d: any) => ({
                        title: d.track.title,
                        subtitle: d.track.subtitle,
                        joecolor: d.track.images.joecolor,
                        key: d.track.key,
                        images: {
                            background: d.track.images.background,
                            coverart: d.track.images.coverart,
                            joecolor: d.track.images.joecolor,
                        },
                        hub: d.track.hub,
                    }))
                );
            } catch (err: any) {
                console.log(err.message);
            }
        };
        if (searchDebounce) fethSearch();
    }, [searchDebounce]);
    return (
        <KeyboardAvoidingView
            behavior="height"
            className="flex-1 bg-[#121212] pt-[30px]"
        >
            <View style={{ backgroundColor: "#535353", position: "relative" }}>
                <TextInput
                    value={search}
                    style={{
                        color: "#fff",
                        padding: 10,
                    }}
                    placeholder="Nhập bài hát cần tìm"
                    placeholderTextColor="#ffffff"
                    onChangeText={(e) => setSearch(e)}
                />
                <TouchableOpacity
                    onPress={() => setSearch("")}
                    className="absolute right-[20px] top-[10px]"
                >
                    <Text className="text-white text-[18px]">X</Text>
                </TouchableOpacity>
            </View>
            <ScrollView
                contentContainerStyle={{
                    paddingBottom: 150,
                    paddingHorizontal: 15,
                }}
            >
                {searchData.map((song: any, index: number) => (
                    <SearchResult
                        data={song}
                        key={index}
                        onPress={() => onPress(song)}
                    />
                ))}
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default Search;
