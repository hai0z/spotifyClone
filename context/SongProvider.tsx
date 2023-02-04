import React, { FC, useContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Song } from "../types/song";
import { useSelector } from "react-redux";
import { setCurrentSong } from "../redux/songSlice";
import { db } from "../firebase";
import { RootState } from "../redux/store";
import { useDispatch } from "react-redux";
import { pushToHistory } from "../services/firebaseService";
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
    }, [currentSong]);

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
        pushToHistory(currentSong);
    }, [currentSong]);

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
