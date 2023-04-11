import React, { FC, useContext } from "react";
import { Song } from "../types/song";
import { useSelector } from "react-redux";
import {
    setCurrentSong,
    setListFavourite,
    setLooping,
    setShuffle,
} from "../redux/songSlice";
import { db } from "../firebase";
import { RootState } from "../redux/store";
import { useDispatch } from "react-redux";
import { pushToHistory } from "../services/firebaseService";
import { getData, storeData } from "../utils/localStorage";
interface ISongProviderProp {
    children: React.ReactNode;
}
interface ISongContext {
    isLooping: boolean;
    ListFavourite: Song[];
    isShuffle: boolean;
}
export const SongContext = React.createContext({} as ISongContext);

const SongProvider: FC<ISongProviderProp> = ({ children }) => {
    const dispatch = useDispatch();

    const currentSong = useSelector(
        (state: RootState) => state.song.currentSong
    );

    const ListFavourite = useSelector(
        (state: RootState) => state.song.listFavorite
    );
    const isLooping = useSelector((state: RootState) => state.song.isLooping);
    const isShuffle = useSelector((state: RootState) => state.song.isShuffle);

    const getLatestSong = async () => {
        const song = await getData("song");
        dispatch(setCurrentSong(song as Song));
    };

    const getLooping = async () => {
        const isLooping = await getData("isLooping");
        dispatch(setLooping(isLooping));
    };

    const getShuffle = async () => {
        const isShuffle = await getData("isShuffle");
        dispatch(setShuffle(isShuffle));
    };

    const storeLooping = async () => {
        await storeData<boolean>("isLooping", isLooping);
    };

    const storeShuffle = async () => {
        await storeData<boolean>("isShuffle", isShuffle);
    };

    const storeCurentSong = async () => {
        await storeData<Song>("song", currentSong);
    };

    React.useEffect(() => {
        const q = db.query(db.collection(db.getFirestore(), "likedList"));
        const unsub = db.onSnapshot(q, (querySnapshot) => {
            const data = querySnapshot.docs.map((doc) => {
                return doc.data();
            });
            dispatch(setListFavourite(data as Song[]));
        });
        getLatestSong();
        getLooping();
        getShuffle();
        return () => unsub();
    }, []);

    React.useEffect(() => {
        storeCurentSong();
        pushToHistory(currentSong);
    }, [currentSong]);

    React.useEffect(() => {
        storeLooping();
        storeShuffle();
    }, [isLooping, isShuffle]);

    return (
        <SongContext.Provider
            value={{
                isLooping,
                ListFavourite,
                isShuffle,
            }}
        >
            {children}
        </SongContext.Provider>
    );
};

export const useSongContext = (): ISongContext => {
    const { isLooping, ListFavourite, isShuffle } = useContext(SongContext);
    return {
        isLooping,
        ListFavourite,
        isShuffle,
    };
};
export default SongProvider;
