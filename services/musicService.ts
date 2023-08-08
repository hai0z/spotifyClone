import { HomeData } from "../types/home";

class MusicService {
    private readonly BASE_URL: string =
        "https://ytmusicapi.onrender.com/" as const;

    async getHome() {
        const respone = await fetch(`${this.BASE_URL}/home?r=VN`);
        const data = await respone.json();
        return data;
    }
    async search(keyword: string) {
        const respone = await fetch(
            `${this.BASE_URL}/search?q=${keyword}&f=songs`
        );
        const data = await respone.json();

        return data;
    }
    async getLyrics(keyword: string) {
        const respone = await fetch(
            `${this.BASE_URL}/songs/lyrics?q=${keyword}`
        );
        const data = await respone.json();
        return data;
    }
    async getMetadata(videoId: string) {
        const respone = await fetch(
            `${this.BASE_URL}/songs/metadata?videoId=${videoId}`
        );
        const data = await respone.json();
        return data;
    }
}
const musicService = new MusicService();

export default musicService;
