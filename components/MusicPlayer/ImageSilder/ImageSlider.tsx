import React, { useEffect } from "react";
import { FlashList } from "@shopify/flash-list";
import { Song } from "../../../types/song";
import {
    NativeScrollEvent,
    NativeSyntheticEvent,
    Dimensions,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useSongContext } from "../../../context/SongProvider";
import { RootState } from "../../../redux/store";
import { setCurrentSong } from "../../../redux/songSlice";
import SongImage from "./SongImage";

const { width: SCREEN_WIDTH } = Dimensions.get("screen");
const ImageSlider = () => {
    const { ListFavourite, isShuffle } = useSongContext();
    const [playList] = React.useState<Song[]>(ListFavourite);

    const dispatch = useDispatch();

    const song = useSelector((state: RootState) => state.song.currentSong);

    const currentSongIndex = React.useMemo(
        () => playList.findIndex((s: Song) => s.key == song.key),
        [song.key]
    );
    const flatListRef = React.createRef<FlashList<Song>>();
    const swpipeToChangeSong = (
        e: NativeSyntheticEvent<NativeScrollEvent>
    ): void => {
        const pageNum = Math.min(
            Math.max(
                Math.floor(e.nativeEvent.contentOffset.x / SCREEN_WIDTH + 0.5) +
                    1,
                0
            ),
            ListFavourite.length
        );
        pageNum - 1 != currentSongIndex &&
            dispatch(setCurrentSong(ListFavourite[pageNum - 1]));
    };
    useEffect(() => {
        flatListRef.current?.scrollToIndex({
            index: currentSongIndex == -1 ? 0 : currentSongIndex,
            animated: isShuffle ? false : true,
        });
    }, [song.key]);
    return (
        <FlashList
            keyExtractor={(item) => item.key}
            scrollEventThrottle={32}
            onMomentumScrollEnd={swpipeToChangeSong}
            ref={flatListRef}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 65 }}
            initialScrollIndex={currentSongIndex}
            horizontal
            estimatedItemSize={SCREEN_WIDTH}
            pagingEnabled
            data={playList}
            renderItem={({ item }) => <SongImage item={item} />}
        />
    );
};

export default ImageSlider;
