import ytdl from "react-native-ytdl";

export function getAudioUrl(videoId: string) {
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    return ytdl(videoUrl, {
        quality: "lowestaudio",
    }).then((urls: any) => {
        const { url } = urls[0];
        return url;
    });
}
