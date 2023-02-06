import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getData(key: string) {
    try {
        const data = await AsyncStorage.getItem(key);
        if (data != null) {
            return JSON.parse(data);
        }
    } catch (error) {
        console.log(error);
    }
}
export async function storeData<T>(key: string, data: T) {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error: any) {
        console.log(error);
    }
}
