import { View, Text, Modal, TouchableOpacity } from "react-native";
import React from "react";

const AddToPlaylist = () => {
    const [visible, setVisible] = React.useState(false);
    return (
        <View
            style={{
                flex: 1,
                marginTop: 100,
                justifyContent: "flex-end",
            }}
        >
            <Modal visible={false} transparent>
                <TouchableOpacity
                    className="h-64 flex-1 justify-end flex-col "
                    onPress={() => setVisible(true)}
                >
                    <View className="bg-[#ffffff80] h-64">
                        <Text>AddToPlaylist</Text>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

export default AddToPlaylist;
