import { View, Text, Modal, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import { db } from "../../firebase";
import { Song } from "../../types/song";

interface IModalProps {
    visible: boolean;
    onClose: () => void;
}
const AddPlayListModal: React.FC<IModalProps> = ({ visible, onClose }) => {
    const inputRef = React.createRef<TextInput>();
    const [playListName, setPlaylistName] = React.useState<string>("");

    const createPlayList = async () => {
        try {
            await db.setDoc(
                db.doc(db.getFirestore(), "playlist", playListName),
                {
                    playListName,
                }
            );
            onClose();
        } catch (error: any) {
            console.log(error.message);
        }
    };

    const addToPlaylist = async (playListName: string, song: Song) => {
        try {
            const playListRef = db.doc(
                db.getFirestore(),
                "playlist",
                playListName,
                "playlist",
                song.key
            );
            await db.setDoc(playListRef, { ...song });
        } catch (error) {
            console.log(error);
        }
    };

    React.useEffect(() => {
        console.log(1);
        inputRef.current?.focus();
    }, [visible]);

    return (
        <View className="flex-1 items-center justify-center">
            <Modal visible={visible} animationType="slide">
                <View className="flex-1 h-full w-full bg-gray-900  justify-center items-center">
                    <Text className="text-[32px] font-bold text-center text-white shadow-md">
                        Đăt tên cho playlist của bạn
                    </Text>
                    <TextInput
                        ref={inputRef}
                        className="border-b-2 border-gray-400 h-16 w-9/12 text-[24px] text-white font-bold "
                        onChangeText={(e) => setPlaylistName(e)}
                    />
                    <View className="w-9/12 flex-row justify-items-center justify-center pt-16">
                        <TouchableOpacity
                            onPress={onClose}
                            className="mr-4 w-16"
                        >
                            <Text className="uppercase text-white">Huỷ</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="w-16"
                            onPress={createPlayList}
                        >
                            <Text className="uppercase text-green-500">
                                {playListName.trim().length > 0
                                    ? "Tạo"
                                    : "Bỏ qua"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default AddPlayListModal;
