import React from "react";
import { FlashList } from "@shopify/flash-list";
import { Song } from "../../types/song";
import SongComponent from "./SongComponent";

const SongList = ({
    searchResult,
    playSong,
    displayAnimation,
}: {
    searchResult: Song[];
    playSong: (song: Song) => void;
    displayAnimation: () => void;
}) => {
    console.log("re-render-songlist");
    return (
        <FlashList
            data={searchResult}
            keyExtractor={(item) => item.key}
            estimatedItemSize={65}
            renderItem={({ item }) => (
                <SongComponent
                    song={item}
                    playSong={playSong}
                    displayAnimation={displayAnimation}
                />
            )}
        />
    );
};

export default React.memo(SongList);
