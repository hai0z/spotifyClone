import React, { useCallback, useState } from "react";
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
    const [selectedId, setSelectedId] = useState<null | string>(null);

    const handleSelected = useCallback((id: string) => {
        return setSelectedId(id);
    }, []);
    console.log(selectedId);
    return (
        <FlashList
            nestedScrollEnabled
            removeClippedSubviews
            data={searchResult}
            estimatedItemSize={65}
            renderItem={({ item }) => (
                <SongComponent
                    song={item}
                    onSelected={handleSelected}
                    isSelected={item.key == selectedId}
                    playSong={playSong}
                    displayAnimation={displayAnimation}
                />
            )}
        />
    );
};

export default React.memo(SongList);
