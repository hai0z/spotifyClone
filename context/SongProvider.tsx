import React, { FC, useContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Song } from "../types/song";

export const SongContext = React.createContext({} as ISongContext);

interface ISongProviderProp {
    children: React.ReactNode;
}

interface ISongContext {
    currentSong: Song & Partial<any>;
    setCurrentSong: React.Dispatch<React.SetStateAction<Song & any>>;
}
const SongProvider: FC<ISongProviderProp> = ({ children }) => {
    const [currentSong, setCurrentSong] = useState<Song>({} as Song);

    const storeData = async () => {
        try {
            await AsyncStorage.setItem("song", JSON.stringify(currentSong));
        } catch (err) {
            console.log(err);
        }
    };

    const findLatestSong = async () => {
        const song = await AsyncStorage.getItem("song");
        if (song != null) {
            setCurrentSong(JSON.parse(song));
        } else {
            setCurrentSong({} as Song);
        }
    };

    React.useEffect(() => {
        findLatestSong();
    }, []);

    React.useEffect(() => {
        storeData();
    }, [currentSong]);

    return (
        <SongContext.Provider
            value={{
                currentSong,
                setCurrentSong,
            }}
        >
            {children}
        </SongContext.Provider>
    );
};

export const useSongContext = (): ISongContext => {
    const { currentSong, setCurrentSong } = useContext(SongContext);
    return {
        currentSong,
        setCurrentSong,
    };
};
export default SongProvider;
