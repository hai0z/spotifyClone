import { Text, View } from "react-native";
import React from "react";
import { Content, HomeData } from "../../types/home";
import { FlashList } from "@shopify/flash-list";
import PlayListCard from "../MusicCard/PlayListCard";
import usePlayerAnimation from "../../hooks/usePlayerAnimation";
import { ISong } from "../../types/song";

interface IProps {
    quickPickData: HomeData;
    title: string;
    subTitle?: string;
}

const QuickPick: React.FC<IProps> = ({ quickPickData, title, subTitle }) => {
    console.log("hehe", quickPickData);
    const { displayAnimation } = usePlayerAnimation();
    return (
        <View style={{ height: 256 }}>
            <Text className="text-white uppercase font-semibold mb-2">
                {subTitle}
            </Text>
            <Text className="text-white font-bold text-2xl mb-4">{title}</Text>
            <View style={{ height: 256 }}>
                <FlashList
                    horizontal
                    estimatedItemSize={200}
                    data={quickPickData?.contents}
                    renderItem={({ item }) => (
                        <PlayListCard
                            playList={item as Content & ISong}
                            displayAnimation={displayAnimation}
                        />
                    )}
                />
            </View>
        </View>
    );
};

export default QuickPick;
