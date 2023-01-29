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
        const { data }: AxiosResponse<Song[] & { tracks: { hits: [] } }> =
            await axios.request(options);

        return data.tracks.hits.map(
            (respone: Song & { track: Required<Song> }) => ({
                title: respone.track.title,
                subtitle: respone.track.subtitle,
                joecolor: respone.track.images.joecolor,
                key: respone.track.key,
                images: {
                    background: respone.track.images.background,
                    coverart: respone.track.images.coverart,
                    joecolor: respone.track.images.joecolor,
                },
                hub: respone.track.hub,
            })
        );
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
    const NUMBER_SONG_TO_TAKE = 6;

    const song: Song[] = [];

    const q = db.query(
        db.collection(db.getFirestore(), "playHistory"),
        db.orderBy("time", "desc"),
        db.limit(NUMBER_SONG_TO_TAKE)
    );

    const querySnapshot = await db.getDocs(q);

    querySnapshot.forEach((doc) => {
        song.push(doc.data() as Song);
    });
    return song;
};
