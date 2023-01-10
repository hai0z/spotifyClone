import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo } from "@expo/vector-icons";
import { navigation } from "../types/RootStackParamList";
import { useSongContext } from "../context/SongProvider";

const LibraryScreeens = ({
    navigation,
}: {
    navigation: navigation<"HomeTab">;
}) => {
    const { ListFavourite } = useSongContext();
    return (
        <View style={styles.container}>
            <View style={styles.top}>
                <View style={styles.topLeft}>
                    <Image
                        resizeMode="cover"
                        style={styles.avatar}
                        source={{
                            uri: "https://timanhdep.com/wp-content/uploads/2022/06/hinh-avatar-anime-nu-de-thuong-cuc-cute-06.jpg",
                        }}
                    />
                    <Text style={styles.txt}>Your Library</Text>
                </View>
                <AntDesign name="plus" size={24} style={styles.plusIcon} />
            </View>
            <View
                // horizontal
                style={{
                    height: 40,
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                {["Danh sách phát", "Nghệ sĩ"].map((item, index) => (
                    <View
                        key={index}
                        style={{
                            height: 30,
                            borderWidth: 1,
                            borderColor: "#dbdbdb",
                            paddingHorizontal: 15,
                            borderRadius: 12,
                            marginHorizontal: 7,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Text style={{ color: "#fff" }}>{item}</Text>
                    </View>
                ))}
            </View>
            <View style={{ flex: 1, marginHorizontal: 10, marginTop: 20 }}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate("ListFavourite");
                    }}
                    activeOpacity={0.8}
                    style={{ flexDirection: "row", alignItems: "center" }}
                >
                    <LinearGradient
                        colors={["blue", "#bdbdbd"]}
                        style={{
                            width: 80,
                            height: 80,
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Entypo name="heart" size={36} color="#fff" />
                    </LinearGradient>
                    <View style={{ marginLeft: 10 }}>
                        <Text
                            style={{
                                color: "#fff",
                                fontWeight: "bold",
                                marginBottom: 5,
                            }}
                        >
                            Bài hát đã thích
                        </Text>
                        <Text style={{ color: "#bdbdbd" }}>
                            Danh sách phát • {ListFavourite.length} bài hát
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default LibraryScreeens;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
        paddingTop: 40,
    },
    avatar: {
        width: 45,
        height: 45,
        borderRadius: 45 / 2,
    },
    top: {
        height: 65,
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
    },
    topLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    txt: {
        fontWeight: "bold",
        fontSize: 20,
        color: "#fff",
        marginLeft: 5,
    },
    plusIcon: {
        color: "#bdbdbd",
    },
});
