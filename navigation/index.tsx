import * as React from "react";
import { Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { navigation, RootStackParamList } from "../types/RootStackParamList";
import MusicPlayerScreens from "../screens/MusicPlayerScreens";
import AlbumAndArtist from "../screens/AlbumAndArtist";
import MusicPlayer from "../components/MusicPlayer";

const Stack = createNativeStackNavigator<RootStackParamList>();

const Tab = createBottomTabNavigator();

function SettingsScreen() {
    return (
        <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
            <Text>Settings!</Text>
        </View>
    );
}
const HomeTabScreen = () => {
    return (
        <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName="HomeTab"
        >
            <Stack.Screen name={"HomeTab"} component={HomeScreen} />
            <Stack.Screen name={"Album"} component={AlbumAndArtist} />
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
                    } else if (route.name === "Lib") {
                        return (
                            <Ionicons
                                name="library-outline"
                                size={24}
                                color={color}
                            />
                        );
                    }
                },
                headerShown: false,
                tabBarStyle: {
                    position: "absolute",
                    backgroundColor: "#121212CE",
                    borderTopWidth: 0,
                    bottom: 0,
                    right: 0,
                    height: 50,
                },
                tabBarActiveTintColor: "#fff",
                tabBarInactiveTintColor: "gray",
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
                component={SettingsScreen}
                options={{
                    title: "Tìm kiếm",
                }}
            />
            <Tab.Screen
                name="Lib"
                component={SettingsScreen}
                options={{
                    title: "Thư viện",
                }}
            />
        </Tab.Navigator>
    );
};
const HomeTabWrapper = ({
    navigation,
}: {
    navigation: navigation<"HomeTab">;
}) => {
    return (
        <View style={{ flex: 1, width: "100%" }}>
            <HomeTab />
            <MusicPlayer navigation={navigation} />
        </View>
    );
};
export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name="HomeTab" component={HomeTabWrapper} />
                <Stack.Screen
                    name="MusicPlayer"
                    options={{
                        animation: "slide_from_bottom",
                        customAnimationOnGesture: true,
                    }}
                    component={MusicPlayerScreens}
                />
                <Stack.Screen name="Album" component={AlbumAndArtist} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
