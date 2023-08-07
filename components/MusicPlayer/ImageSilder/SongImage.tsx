import { Dimensions, Image } from "react-native";
import React, { memo } from "react";
import { ISong } from "../../../types/song";
const { width: SCREEN_WITH } = Dimensions.get("screen");

interface ISongImageProps {
    item: ISong;
}
const SongImage: React.FC<ISongImageProps> = ({ item }) => {
    console.log("re-render-songImg");
    return (
        <Image
            source={{
                uri: item?.thumbnails?.[item?.thumbnails?.length - 1]?.url,
            }}
            style={{
                width: SCREEN_WITH,
                height: SCREEN_WITH,
                transform: [{ scale: 0.9 }],
            }}
        />
    );
};

export default memo(SongImage);
