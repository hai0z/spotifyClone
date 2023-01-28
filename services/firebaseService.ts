import axios, { AxiosResponse } from "axios";
import { db } from "../firebase";
import { Song } from "../types/song";

export const searchingSong = async (
    searchParams: string
): Promise<Song[] | undefined> => {
    const options = {
        method: "GET",
        url: "https://shazam-core.p.rapidapi.com/v1/search/multi",
        params: { query: `${searchParams}`, search_type: "SONGS" },
        headers: {
            "X-RapidAPI-Key":
                "25afd00c31msh690f22c6a3516c0p1799adjsn0eade0e56e0b",
            "X-RapidAPI-Host": "shazam-core.p.rapidapi.com",
        },
    };
    try {
        const { data }: AxiosResponse = await axios.request(options);
        return data.tracks.hits.map((d: Song & { track: Song }) => ({
            title: d.track.title,
            subtitle: d.track.subtitle,
            joecolor: d.track.images.joecolor,
            key: d.track.key,
            images: {
                background: d.track.images.background,
                coverart: d.track.images.coverart,
                joecolor: d.track.images.joecolor,
            },
            hub: d.track.hub,
        }));
    } catch (err: any) {
        console.log(err.message);
    }
};

export const getSong = async (): Promise<Song[]> => {
    const q = db.query(db.collection(db.getFirestore(), "likedList"));
    const track: Song[] = [];
    const querySnapshot = await db.getDocs(q);
    querySnapshot.forEach((doc) => {
        track.push(doc.data() as Song);
    });
    return track;
};

export const addToLikedList = async (
    likedSong: Song,
    currentSong: Song,
    ListFavourite: Song[]
): Promise<void> => {
    try {
        const docRef = db.doc(db.getFirestore(), "likedList", currentSong.key);
        if (ListFavourite.some((s: Song) => s.key == likedSong.key)) {
            await db.deleteDoc(docRef);
        } else {
            await db.setDoc(docRef, likedSong);
        }
    } catch (err: any) {
        console.log(err.message);
    }
};

export const getPlayHistory = async (): Promise<Song[]> => {
    const song: Song[] = [];
    const q = db.query(
        db.collection(db.getFirestore(), "playHistory"),
        db.orderBy("time", "desc"),
        db.limit(6)
    );
    const querySnapshot = await db.getDocs(q);
    querySnapshot.forEach((doc) => {
        song.push(doc.data() as Song);
    });
    return song;
};
