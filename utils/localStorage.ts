import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getData(key: string) {
    const data = await AsyncStorage.getItem(key);

    return data;
}
export async function storeData<T>(key: string, data: T) {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error: any) {
        console.log(error);
    }
}
