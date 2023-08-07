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
import { ISong } from "../types/song";
import { useDispatch } from "react-redux";
import { setCurrentSong, setPlaying, setSongLoaded } from "../redux/songSlice";
import { FontAwesome } from "@expo/vector-icons";
import musicService from "../services/musicService";
import { getAudioUrl } from "../services/youtube";
interface ISearchResultProps {
    data: ISong;
    onPress: (data: ISong) => void;
}
const SearchResult: React.FC<ISearchResultProps> = ({ data, onPress }) => {
    return (
        <TouchableOpacity
            onPress={() => onPress(data)}
            style={{
                height: 50,
                marginTop: 20,
                flexDirection: "row",
            }}
        >
            <Image
                source={{ uri: data?.thumbnails?.[0]?.url }}
                className="w-[50px] h-[50px] object-cover"
            />
            <View className="flex flex-col justify-between ml-[10px] w-full">
                <Text
                    className="text-white font-semibold capitalize max-w-[70%]"
                    numberOfLines={1}
                >
                    {data?.title}
                </Text>
                <Text style={{ color: "#bdbdbd", fontWeight: "500" }}>
                    {data?.artists?.[0]?.name}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const Search = () => {
    const [search, setSearch] = useState<string>("");

    const searchDebounce = useDebounce(search, 300);

    const [searchData, setSearchData] = useState([] as any);

    const dispatch = useDispatch();

    const onPressSong = useCallback(async (song: ISong) => {
        try {
            dispatch(setSongLoaded(false));
            const url = await getAudioUrl(song.videoId);
            dispatch(setCurrentSong({ ...song, audioUrl: url }));
            dispatch(
                setPlaying({
                    isPlaying: true,
                    playFrom: {
                        from: "search",
                        name: `Nội dung: ${search}`,
                    },
                })
            );
        } catch (error) {
            console.log(error);
        } finally {
            dispatch(setSongLoaded(true));
        }
    }, []);

    useEffect(() => {
        const fetchSearch = async () => {
            try {
                const data = await musicService.search(search);
                setSearchData(data);
            } catch (err: any) {
                console.log(err.message);
            }
        };
        if (searchDebounce) fetchSearch();
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
                    className="absolute right-[20px] top-[10px] w-8 h-8 flex items-center justify-center"
                >
                    <FontAwesome name="remove" size={24} color="white" />
                </TouchableOpacity>
            </View>
            <ScrollView
                contentContainerStyle={{
                    paddingBottom: 150,
                    paddingHorizontal: 15,
                }}
            >
                {searchData?.map((song: ISong, index: number) => (
                    <SearchResult
                        data={song}
                        key={index}
                        onPress={onPressSong}
                    />
                ))}
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default Search;
