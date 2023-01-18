import {
    View,
    Text,
    Modal,
    TouchableWithoutFeedback,
    Image,
    TouchableOpacity,
    Animated,
} from "react-native";
import React from "react";
import { db } from "../../firebase";
interface IPlayListManageProps {
    visible: boolean;
    onClose: () => void;
    playListName: string;
}
const PlayListManage = ({
    visible,
    onClose,
    playListName,
}: IPlayListManageProps) => {
    const removePlaylist = async (playlistName: string) => {
        const playListRef = db.doc(db.getFirestore(), "playlist", playlistName);
        try {
            await db.deleteDoc(playListRef);
            onClose();
        } catch (error) {
            console.log(error);
        }
    };
    const slideAnimated = React.useRef(new Animated.Value(-500)).current;

    React.useEffect(() => {
        Animated.timing(slideAnimated, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
        }).start();
    }, [visible]);
    return (
        <Modal visible={visible} animationType="slide">
            <TouchableWithoutFeedback onPress={onClose}>
                <Animated.View
                    className="flex-1 bg-black items-center justify-center"
                    style={{ transform: [{ translateY: slideAnimated }] }}
                >
                    <View>
                        <Image
                            resizeMode="cover"
                            className="w-32 h-32"
                            source={{
                                uri: "https://is3-ssl.mzstatic.com/image/thumb/Music2/v4/b0/75/ec/b075ec42-a102-cde1-132b-9cddbc0d3496/825646285891.jpg/400x400cc.jpg",
                            }}
                        />
                        <Text className="text-white font-semibold mt-4 text-center text-[22px]">
                            {playListName}
                        </Text>
                    </View>
                    <View className="flex items-start justify-start mt-4">
                        <TouchableOpacity
                            onPress={() => removePlaylist(playListName)}
                        >
                            <Text className="text-[22px] text-white">
                                Xoá Playlist
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default PlayListManage;
