import {
    Text,
    View,
    TextInput,
    ScrollView,
    Image,
    TouchableOpacity,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";
import axios, { AxiosResponse } from "axios";
import { Song } from "../types/song";
import { useSongContext } from "../context/SongProvider";
import { useDispatch } from "react-redux";
import { setPlaying } from "../redux/songSlice";

const SearchResult = ({
    data,
    onPress,
}: {
    data: Song;
    onPress: () => void;
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                height: 50,
                marginTop: 20,
                display: "flex",
                flexDirection: "row",
            }}
        >
            <Image
                source={{ uri: data.images.coverart }}
                style={{
                    width: 50,
                    height: 50,
                    resizeMode: "cover",
                }}
            />
            <View
                style={{
                    flexDirection: "column",
                    justifyContent: "space-between",
                    marginLeft: 10,
                    width: "100%",
                }}
            >
                <Text
                    style={{
                        color: "#fff",
                        fontWeight: "700",
                        textTransform: "capitalize",
                        maxWidth: "70%",
                    }}
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

    const searchDebounce = useDebounce(search, 150);

    const [searchData, setSearchData] = useState([] as any);

    const dispatch = useDispatch();
    const options = {
        method: "GET",
        url: "https://shazam-core.p.rapidapi.com/v1/search/multi",
        params: { query: `${search}`, search_type: "SONGS" },
        headers: {
            "X-RapidAPI-Key":
                "fcfe5a00eemshcaa5ba933a8931dp18407cjsn06329a84995b",
            "X-RapidAPI-Host": "shazam-core.p.rapidapi.com",
        },
    };
    const { setCurrentSong } = useSongContext();
    const onPress = useCallback((song: Song & any) => {
        setCurrentSong(song);
        dispatch(setPlaying());
    }, []);

    useEffect(() => {
        const fethSearch = async () => {
            try {
                const { data }: AxiosResponse = await axios.request(options);
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
        <View
            style={{ flex: 1, paddingBottom: 120, backgroundColor: "#121212" }}
        >
            <ScrollView
                style={{
                    backgroundColor: "#121212",
                    marginTop: 30,
                }}
            >
                <View
                    style={{ backgroundColor: "#535353", position: "relative" }}
                >
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
                        style={{ position: "absolute", right: 20, top: 10 }}
                    >
                        <Text style={{ color: "#fff", fontSize: 18 }}>X</Text>
                    </TouchableOpacity>
                </View>
                {searchData.map((song: any, index: number) => (
                    <SearchResult
                        data={song}
                        key={index}
                        onPress={() => onPress(song)}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

export default Search;
