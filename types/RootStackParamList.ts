import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Song } from "./song";

export type RootStackParamList = {
    HomeTab: undefined;
    Album: undefined;
    MusicPlayer: undefined;
    ListFavourite: {
        type: "favourite" | "playlist";
        playlistName?: string;
    };
    Lib: undefined;
    History: undefined;
    Splash: undefined;
    Lyric: {
        song: Song & { sections?: any };
        bgColor: string;
    };
};

export type RootStackProps<T extends keyof RootStackParamList> = {
    navigation: NativeStackNavigationProp<RootStackParamList, T>;
};

export type navigation<T extends keyof RootStackParamList> =
    NativeStackNavigationProp<RootStackParamList, T>;

export type route<T extends keyof RootStackParamList> = RouteProp<
    RootStackParamList,
    T
>;
