import React, { FC, useContext, useMemo, useState } from "react";
import { ISong, Lyrics } from "../types/song";
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
import axios from "axios";
import musicService from "../services/musicService";
interface ISongProviderProp {
    children: React.ReactNode;
}
interface ISongContext {
    isLooping: boolean;
    ListFavourite: ISong[];
    isShuffle: boolean;
    joeColor: any;
    lyrics: Lyrics;
    currentLine: number | undefined;
    getCurrentLyricLine: number | undefined;
}
export const SongContext = React.createContext({} as ISongContext);

const SongProvider: FC<ISongProviderProp> = ({ children }) => {
    const dispatch = useDispatch();
    const { musicState } = useSelector((state: RootState) => state.song);
    const { currentSong } = useSelector((state: RootState) => state.song);

    const [joeColor, setJoeColor] = useState("#cccccc");

    const [lyrics, setLyrics] = useState<Lyrics>({} as Lyrics);
    const [currentLine, setCurrentLine] = useState<number | undefined>(0);
    const ListFavourite = useSelector(
        (state: RootState) => state.song.listFavorite
    );
    const isLooping = useSelector((state: RootState) => state.song.isLooping);
    const isShuffle = useSelector((state: RootState) => state.song.isShuffle);

    const getLatestSong = async () => {
        const song = await getData("song");
        dispatch(setCurrentSong(song));
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
        await storeData<ISong>("song", currentSong);
    };

    React.useEffect(() => {
        const q = db.query(db.collection(db.getFirestore(), "likedList"));
        const unsub = db.onSnapshot(q, (querySnapshot) => {
            const data = querySnapshot.docs.map((doc) => {
                return doc.data();
            });
            dispatch(setListFavourite(data as ISong[]));
        });
        getLatestSong();
        getLooping();
        getShuffle();
        return () => unsub();
    }, []);

    const getCurrentLyricLine = useMemo(() => {
        if (lyrics) {
            let low = 0;
            let high = lyrics?.lines?.length - 1;
            let result = -1;

            while (low <= high) {
                const mid = Math.floor((low + high) / 2);
                const midTime = +lyrics.lines[mid].startTimeMs - 500;
                if (midTime <= +musicState.position) {
                    result = mid;
                    low = mid + 1;
                } else {
                    high = mid - 1;
                }
            }

            if (result !== -1 && currentLine !== result) {
                console.log(1);

                setCurrentLine(result);
            }

            return result;
        }
    }, [musicState.position]);

    React.useEffect(() => {
        console.log("call api");
        axios
            .get("https://api.sightengine.com/1.0/check.json", {
                params: {
                    url: currentSong?.thumbnails?.[0].url,
                    models: "properties",
                    api_user: "1840465717",
                    api_secret: "kd2R6XfwMQEgFqLNVQ83",
                },
            })
            .then(function (response) {
                setJoeColor(response.data);
            })
            .catch(function (error) {
                // handle error
                if (error.response) console.log(error.response.data);
                else console.log(error.message);
            });
    }, [currentSong]);

    React.useEffect(() => {
        setCurrentLine(0);
        storeCurentSong();
        pushToHistory(currentSong);
    }, [currentSong.videoId]);

    React.useEffect(() => {
        const getLyric = async () => {
            try {
                const res = await musicService.getLyrics(currentSong.title);
                setLyrics(res);
            } catch (error) {
                setLyrics({ ...lyrics, error: true });
            }
        };
        getLyric();
    }, [currentSong?.videoId]);
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
                joeColor,
                lyrics,
                getCurrentLyricLine,
                currentLine,
            }}
        >
            {children}
        </SongContext.Provider>
    );
};

export const useSongContext = (): ISongContext => {
    const {
        isLooping,
        ListFavourite,
        isShuffle,
        joeColor,
        lyrics,
        currentLine,
        getCurrentLyricLine,
    } = useContext(SongContext);
    return {
        isLooping,
        ListFavourite,
        isShuffle,
        joeColor,
        lyrics,
        currentLine,
        getCurrentLyricLine,
    };
};
export default SongProvider;
