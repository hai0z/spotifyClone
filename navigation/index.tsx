import React, { Fragment } from "react";
import { View } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { navigation, RootStackParamList } from "../types/RootStackParamList";
import MusicPlayerScreens from "../screens/MusicPlayerScreens";
import AlbumAndArtist from "../screens/AlbumAndArtist";
import MusicPlayer from "../components/MusicPlayer/FloatingMusicPlayer";
import Search from "../screens/Search";
import LibraryScreeens from "../screens/LibraryScreeens";
import ListFavourite from "../screens/ListFavourite";
import PlayHistoryScreen from "../screens/PlayHistory";
import { tabBarItemStyle, tabBarStyle } from "./style";
import SplashScreens from "../screens/SplashScreens";
import LyricScreens from "../screens/LyricScreens";

const Stack = createNativeStackNavigator<RootStackParamList>();

const Tab = createBottomTabNavigator();

const HomeTabScreen = () => {
    return (
        <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName="HomeTab"
        >
            <Stack.Screen name="HomeTab" component={HomeScreen} />
            <Stack.Screen name="Album" component={AlbumAndArtist} />
            <Stack.Screen
                name="History"
                component={PlayHistoryScreen}
                options={{
                    animation: "none",
                }}
            />
        </Stack.Navigator>
    );
};
const LibraryStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName="Lib"
        >
            <Stack.Screen name="Lib" component={LibraryScreeens} />
            <Stack.Screen
                name="ListFavourite"
                component={ListFavourite}
                options={{
                    animation: "slide_from_right",
                }}
            />
        </Stack.Navigator>
    );
};

const HomeTab = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    if (route.name === "Home") {
                        return <Entypo name="home" size={size} color={color} />;
                    } else if (route.name === "Search") {
                        return (
                            <FontAwesome
                                name="search"
                                size={24}
                                color={color}
                            />
                        );
                    } else if (route.name === "Library") {
                        return (
                            <MaterialIcons
                                name="library-music"
                                size={24}
                                color={color}
                            />
                        );
                    }
                },
                headerShown: false,
                tabBarStyle,
                tabBarActiveTintColor: "#fff",
                tabBarInactiveTintColor: "gray",
                tabBarIconStyle: {
                    bottom: -5,
                },
                tabBarItemStyle,
                tabBarLabelStyle: {
                    bottom: 5,
                },
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeTabScreen}
                options={{
                    title: "Trang chủ",
                }}
            />
            <Tab.Screen
                name="Search"
                component={Search}
                options={{
                    title: "Tìm kiếm",
                }}
            />
            <Tab.Screen
                name="Library"
                component={LibraryStack}
                options={{
                    title: "Thư viện",
                }}
            />
        </Tab.Navigator>
    );
};
const HomeTabWrapper = () => {
    const navigation = useNavigation<navigation<"HomeTab">>();
    return (
        <Fragment>
            <HomeTab />
            <MusicPlayer navigation={navigation} />
        </Fragment>
    );
};
export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Splash"
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name="Splash" component={SplashScreens} />

                <Stack.Screen
                    name="HomeTab"
                    component={HomeTabWrapper}
                    options={{
                        animation: "none",
                        customAnimationOnGesture: true,
                    }}
                />
                <Stack.Screen
                    name="MusicPlayer"
                    options={{
                        animation: "slide_from_bottom",
                        customAnimationOnGesture: true,
                    }}
                    component={MusicPlayerScreens}
                />
                <Stack.Screen name="Album" component={AlbumAndArtist} />
                <Stack.Screen name="Lyric" component={LyricScreens} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
