import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo } from "@expo/vector-icons";
import { navigation } from "../types/RootStackParamList";
import { useSongContext } from "../context/SongProvider";
import AddPlayListModal from "../components/Modal/CreatePlayListModal";
import { db } from "../firebase";
import PlayListManage from "../components/Modal/PlayListManage";

interface IPlayList {
    name: string;
}
const LibraryScreeens = ({
    navigation,
}: {
    navigation: navigation<"HomeTab">;
}) => {
    const { ListFavourite } = useSongContext();
    const [modalVisible, setModalVisible] = React.useState(false);
    const [PlayListManageVisible, setPlayListManageVisible] =
        React.useState(false);
    const [playList, setPlayList] = React.useState<IPlayList[]>([]);
    const handleOpenModal = () => {
        setModalVisible(true);
    };
    const handleCloseModal = () => {
        setModalVisible(false);
    };
    React.useEffect(() => {
        const getPlayList = () => {
            const q = db.query(db.collection(db.getFirestore(), "playlist"));
            db.onSnapshot(q, (querySnapshot) => {
                const pl: IPlayList[] = [];
                querySnapshot.forEach((doc) => {
                    pl.push({
                        name: doc.data().playListName,
                    });
                });
                setPlayList(pl as IPlayList[]);
            });
        };
        getPlayList();
        return () => getPlayList();
    }, []);

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
                <TouchableOpacity onPress={handleOpenModal}>
                    <AntDesign name="plus" size={24} style={styles.plusIcon} />
                </TouchableOpacity>
            </View>
            <View className="h-10 flex-row items-center">
                {["Danh sách phát", "Nghệ sĩ"].map((item, index) => (
                    <View
                        key={index}
                        style={{ borderColor: "#dbdbdb" }}
                        className="h-[30px] items-center justify-center mx-[7px] px-[15px] rounded-[12px] border"
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
                    className="flex-row items-center"
                >
                    <LinearGradient
                        colors={["blue", "#bdbdbd"]}
                        className="w-20 h-20 justify-center items-center"
                    >
                        <Entypo name="heart" size={36} color="#fff" />
                    </LinearGradient>
                    <View style={{ marginLeft: 10 }}>
                        <Text className="text-white font-bold mb-[5px]">
                            Bài hát đã thích
                        </Text>
                        <Text style={{ color: "#bdbdbd" }}>
                            Danh sách phát • {ListFavourite.length} bài hát
                        </Text>
                    </View>
                </TouchableOpacity>
                {playList.map((pl: IPlayList) => {
                    return (
                        <TouchableOpacity
                            onLongPress={() => setPlayListManageVisible(true)}
                            key={pl.name}
                            className="flex-row items-center pt-2"
                        >
                            <LinearGradient
                                colors={["blue", "#bdbdbd"]}
                                className="w-20 h-20 justify-center items-center"
                            >
                                <Entypo name="heart" size={36} color="#fff" />
                            </LinearGradient>
                            <View style={{ marginLeft: 10 }}>
                                <Text className="text-white font-bold mb-[5px]">
                                    {pl.name}
                                </Text>
                                <Text style={{ color: "#bdbdbd" }}>
                                    Danh sách phát
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
            <AddPlayListModal
                visible={modalVisible}
                onClose={handleCloseModal}
            />
            <PlayListManage visible={PlayListManageVisible} />
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
