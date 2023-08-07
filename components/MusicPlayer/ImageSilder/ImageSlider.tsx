import React, { useEffect } from "react";
import { FlashList } from "@shopify/flash-list";
import { ISong, Song } from "../../../types/song";
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

    const dispatch = useDispatch();

    const song = useSelector((state: RootState) => state.song.currentSong);
    const [playList] = React.useState<ISong[]>([{ ...song }]);
    const currentSongIndex = React.useMemo(
        () => playList.findIndex((s) => s.videoId == song.videoId),
        [song.videoId]
    );
    const flatListRef = React.createRef<FlashList<ISong>>();

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
    }, [song.videoId]);

    return (
        <FlashList
            keyExtractor={(item) => item.videoId}
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
