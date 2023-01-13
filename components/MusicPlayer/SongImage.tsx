import { Dimensions, Image } from "react-native";
import React, { memo } from "react";
import { Song } from "../../types/song";
const { width: SCREEN_WITH } = Dimensions.get("screen");

const SongImage = ({ item }: { item: Song }) => {
    console.log("re-render-songImg");
    return (
        <Image
            source={{ uri: item?.images?.coverart }}
            style={{
                width: SCREEN_WITH,
                height: SCREEN_WITH,
                transform: [{ scale: 0.9 }],
            }}
        />
    );
};

export default memo(SongImage);
