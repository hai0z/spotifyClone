import React, { FC, useContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Song } from "../types/song";
import axios from "axios";
export const SongContext = React.createContext({} as ISongContext);

interface ISongProviderProp {
    children: React.ReactNode;
}

interface ISongContext {
    currentSong: Song & Partial<any>;
    setCurrentSong: React.Dispatch<React.SetStateAction<Song & any>>;
    nextSong: any;
    setNextSong: any;
    isLooping: any;
    setIsLooping: any;
}
const SongProvider: FC<ISongProviderProp> = ({ children }) => {
    const [currentSong, setCurrentSong] = useState<Song>({} as Song);
    const [nextSong, setNextSong] = useState<Song>({} as Song);
    const [loading, setLoading] = useState(true);
    const [isLooping, setIsLooping] = useState<boolean | any>(async () => {
        const rs = await AsyncStorage.getItem("isLooping");
        if (rs != null) {
            setIsLooping(JSON.parse(rs));
        } else {
            setIsLooping(false);
        }
    });
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
    const getRelatedTrack = async () => {
        console.log(`get releated`);
        const options = {
            method: "GET",
            url: "https://shazam-core.p.rapidapi.com/v1/tracks/related",
            params: { track_id: `${currentSong.key}` },
            headers: {
                "X-RapidAPI-Key":
                    "25afd00c31msh690f22c6a3516c0p1799adjsn0eade0e56e0b",
                "X-RapidAPI-Host": "shazam-core.p.rapidapi.com",
            },
        };

        try {
            let { data: relatedId } = await axios.request(options);
            relatedId = relatedId.map((r: any) => r.key)[0];
            const options2 = {
                method: "GET",
                url: "https://shazam-core.p.rapidapi.com/v1/tracks/details",
                params: { track_id: `${relatedId}` },
                headers: {
                    "X-RapidAPI-Key":
                        "25afd00c31msh690f22c6a3516c0p1799adjsn0eade0e56e0b",
                    "X-RapidAPI-Host": "shazam-core.p.rapidapi.com",
                },
            };
            const { data: nextS } = await axios.request(options2);
            setNextSong(nextS);
            setLoading(false);
        } catch (err: any) {
            console.error(err);
        }
    };
    React.useEffect(() => {
        findLatestSong();
    }, []);

    React.useEffect(() => {
        storeData();
        getRelatedTrack();
    }, [currentSong]);

    React.useEffect(() => {
        async function storeLooping() {
            try {
                await AsyncStorage.setItem(
                    "isLooping",
                    JSON.stringify(isLooping)
                );
            } catch (err) {
                console.log(err);
            }
        }
        storeLooping();
    }, [isLooping]);

    if (loading) return null;

    return (
        <SongContext.Provider
            value={{
                currentSong,
                setCurrentSong,
                nextSong,
                setNextSong,
                isLooping,
                setIsLooping,
            }}
        >
            {children}
        </SongContext.Provider>
    );
};

export const useSongContext = (): ISongContext => {
    const {
        currentSong,
        setCurrentSong,
        nextSong,
        setNextSong,
        isLooping,
        setIsLooping,
    } = useContext(SongContext);
    return {
        currentSong,
        setCurrentSong,
        nextSong,
        setNextSong,
        isLooping,
        setIsLooping,
    };
};
export default SongProvider;
