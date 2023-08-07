export interface HomeData {
    title: string;
    contents: Content[];
}

export interface Content {
    title: string;
    videoId?: string;
    artists?: Artist[];
    thumbnails: Thumbnail[];
    isExplicit?: boolean;
    album?: Album;
    playlistId?: string;
    description?: string;
    views?: string;
    year?: string;
    browseId?: string;
}

interface Album {
    name: string;
    id: string;
}

export interface Thumbnail {
    url: string;
    width: number;
    height: number;
}

export interface Artist {
    name: string;
    id?: (null | string)[] | null | string | string;
}
