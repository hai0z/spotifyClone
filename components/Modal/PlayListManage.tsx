import { View, Text, Modal, TouchableWithoutFeedback } from "react-native";
import React from "react";

interface IPlayListManageProps {
    visible: boolean;
}
const PlayListManage = ({ visible }: IPlayListManageProps) => {
    return (
        <Modal visible={visible}>
            <TouchableWithoutFeedback onPress={() => console.log(1)}>
                <View className="flex-1 bg-slate-800"></View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default PlayListManage;
