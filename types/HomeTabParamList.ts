import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type RootTabParamList = {
    Home: undefined;
    Search: undefined;
    Lib: undefined;
    Album: undefined;
};

export type RootStackProps<T extends keyof RootTabParamList> = {
    navigation: NativeStackNavigationProp<RootTabParamList, T>;
};

export type navigation<T extends keyof RootTabParamList> =
    NativeStackNavigationProp<RootTabParamList, T>;

export type route<T extends keyof RootTabParamList> = RouteProp<
    RootTabParamList,
    T
>;
