export type Song = {
    title: string;
    subtitle: string;
    joecolor: string;
    key: string;
    images: {
        background: string;
        coverart: string;
        joecolor: string;
    };
    hub: any;
};

export interface ISong {
    category: string;
    resultType: string;
    videoId: string;
    videoType: string;
    title: string;
    artists: Artist[];
    views: string;
    duration: string;
    duration_seconds: number;
    thumbnails: Thumbnail[];
    audioUrl: string;
    lyrics?: Lyrics;
}

interface Thumbnail {
    url: string;
    width: number;
    height: number;
}

interface Artist {
    name: string;
    id: string;
}
export interface Lyrics {
    error: boolean;
    syncType: "LINE_SYNCED" | "UNSYNCED" | "NOT_FOUND";
    lines: Line[];
}

export interface Line {
    startTimeMs: string;
    words: string;
    syllables: any[];
    endTimeMs: string;
}
