import axios, { AxiosResponse } from "axios";
import { Song } from "../types/song";

const searchingSong = async (
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

    console.log(`searching...`);
    try {
        const { data }: AxiosResponse = await axios.request(options);
        console.log(data);
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
export default searchingSong;
