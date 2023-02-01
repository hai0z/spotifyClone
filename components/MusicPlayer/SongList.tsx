import React from "react";
import { FlashList } from "@shopify/flash-list";
import { Song } from "../../types/song";
import SongComponent from "./SongComponent";

interface ISongListProps {
    searchResult: Song[];
    playSong: (song: Song) => void;
    displayAnimation: () => void;
}
const SongList: React.FC<ISongListProps> = ({
    searchResult,
    playSong,
    displayAnimation,
}) => {
    console.log("re-render-songlist");
    return (
        <FlashList
            nestedScrollEnabled
            removeClippedSubviews
            data={searchResult}
            estimatedItemSize={65}
            renderItem={({ item, index }) => (
                <SongComponent
                    song={item}
                    index={index}
                    playSong={playSong}
                    displayAnimation={displayAnimation}
                />
            )}
        />
    );
};

export default React.memo(SongList);
