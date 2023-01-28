import { db } from "../firebase";
import { Song } from "../types/song";

const addToLikedList = async (
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
export default addToLikedList;
