import React, { FC, useContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Song } from "../types/song";
import axios from "axios";
import { useSelector } from "react-redux";
import { setCurrentSong } from "../redux/songSlice";
import { db } from "../firebase";
import { RootState } from "../redux/store";
import { useDispatch } from "react-redux";
interface ISongProviderProp {
    children: React.ReactNode;
}
interface ISongContext {
    nextSong: Song[];
    setNextSong: React.Dispatch<React.SetStateAction<Song[]>>;
    isLooping: boolean;
    setIsLooping: React.Dispatch<React.SetStateAction<boolean>>;
    ListFavourite: Song[];
    setListFavourite: React.Dispatch<React.SetStateAction<Song[]>>;
    setIsShuffle: React.Dispatch<React.SetStateAction<boolean>>;
    isShuffle: boolean;
}
export const SongContext = React.createContext({} as ISongContext);

const SongProvider: FC<ISongProviderProp> = ({ children }) => {
    const dispatch = useDispatch();

    const currentSong = useSelector(
        (state: RootState) => state.song.currentSong
    );
    const [nextSong, setNextSong] = useState<Song[]>([]);

    const [loading, setLoading] = useState<boolean>(false);

    const [ListFavourite, setListFavourite] = useState<Song[]>([]);

    const [isLooping, setIsLooping] = useState<boolean>(false);

    const [isShuffle, setIsShuffle] = useState<boolean>(false);

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
            dispatch(setCurrentSong(JSON.parse(song)));
        } else {
            dispatch(setCurrentSong({} as Song));
        }
    };

    const getLoopingStatus = async () => {
        const isLooping = await AsyncStorage.getItem("isLooping");
        if (isLooping != null) {
            setIsLooping(JSON.parse(isLooping));
        } else {
            setIsLooping(false);
        }
    };

    const getShuffleStatus = async () => {
        const isShuffle = await AsyncStorage.getItem("isShuffle");
        if (isShuffle != null) {
            setIsShuffle(JSON.parse(isShuffle));
        } else {
            setIsShuffle(false);
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
            setLoading(false);
        }
    };

    React.useEffect(() => {
        const q = db.query(db.collection(db.getFirestore(), "likedList"));
        const unsub = db.onSnapshot(q, (querySnapshot) => {
            const data = querySnapshot.docs.map((doc) => {
                return doc.data();
            });
            setListFavourite(data as Song[]);
        });
        findLatestSong();
        getLoopingStatus();
        getShuffleStatus();
        return () => unsub();
    }, []);

    React.useEffect(() => {
        storeData();
        // getRelatedTrack();
    }, [currentSong.key]);

    const storeLooping = async () => {
        try {
            await AsyncStorage.setItem("isLooping", JSON.stringify(isLooping));
        } catch (err) {
            console.log(err);
        }
    };

    React.useEffect(() => {
        storeLooping();
    }, [isLooping]);

    React.useEffect(() => {
        const changeShuffleStatus = async () => {
            try {
                await AsyncStorage.setItem(
                    "isShuffle",
                    JSON.stringify(isShuffle)
                );
            } catch (err) {
                console.log(err);
            }
        };
        changeShuffleStatus();
    }, [isShuffle]);

    React.useEffect(() => {
        const pushToHistory = async () => {
            try {
                await db.setDoc(
                    db.doc(db.getFirestore(), "playHistory", currentSong.key),
                    {
                        ...currentSong,
                        time: Date.now(),
                    }
                );
            } catch (err) {
                console.log(err);
            }
        };
        pushToHistory();
    }, [currentSong.key]);

    if (loading) return null;

    return (
        <SongContext.Provider
            value={{
                nextSong,
                setNextSong,
                isLooping,
                setIsLooping,
                setListFavourite,
                ListFavourite,
                setIsShuffle,
                isShuffle,
            }}
        >
            {children}
        </SongContext.Provider>
    );
};

export const useSongContext = (): ISongContext => {
    const {
        nextSong,
        setNextSong,
        isLooping,
        setIsLooping,
        setListFavourite,
        ListFavourite,
        setIsShuffle,
        isShuffle,
    } = useContext(SongContext);
    return {
        nextSong,
        setNextSong,
        isLooping,
        setIsLooping,
        setListFavourite,
        ListFavourite,
        isShuffle,
        setIsShuffle,
    };
};
export default SongProvider;
