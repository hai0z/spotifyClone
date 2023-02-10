import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { REACT_APP_X_RapidAPI_Host, REACT_APP_X_RapidAPI_Key } from "@env";
import { db } from "../firebase";

const lyric = (songId: string) => {
    const options = {
        method: "GET",
        url: "https://shazam-core.p.rapidapi.com/v1/tracks/details",
        params: { track_id: songId },
        headers: {
            "X-RapidAPI-Key": REACT_APP_X_RapidAPI_Key,
            "X-RapidAPI-Host": REACT_APP_X_RapidAPI_Host,
        },
    };
    console.log("1111");
    const [lyric, setLyric] = useState<string[]>([]);

    const getLyric = async () => {
        try {
            const { data } = await axios.request(options);
            await db.updateDoc(db.doc(db.getFirestore(), "likedList", songId), {
                ...data,
            });
            setLyric(data.sections?.[1].text);
        } catch (err: any) {
            console.log(err.message);
        }
    };
    useEffect(() => {
        getLyric();
    }, [songId]);

    return lyric;
};

export default lyric;
