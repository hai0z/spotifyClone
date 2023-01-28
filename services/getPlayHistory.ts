import { db } from "../firebase";
import { Song } from "../types/song";

const getPlayHistory = async (): Promise<Song[]> => {
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

export default getPlayHistory;
