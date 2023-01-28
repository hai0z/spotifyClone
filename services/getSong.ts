import { db } from "../firebase";
import { Song } from "../types/song";

const getSong = async (): Promise<Song[]> => {
    const q = db.query(db.collection(db.getFirestore(), "likedList"));
    const track: Song[] = [];
    const querySnapshot = await db.getDocs(q);
    querySnapshot.forEach((doc) => {
        track.push(doc.data() as Song);
    });
    return track;
};

export default getSong;
