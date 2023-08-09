import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useSongContext } from "../context/SongProvider";

const useSyncLyric = () => {
    const [currentLine, setCurretLine] = useState<number | undefined>();
    const { lyrics } = useSongContext();
    const { musicState } = useSelector((state: RootState) => state.song);
    const getCurrentLyricLine = useMemo(() => {
        if (lyrics) {
            let low = 0;
            let high = lyrics?.lines?.length - 1;
            let result = -1;
            while (low <= high) {
                const mid = Math.floor((low + high) / 2);
                const midTime = +lyrics.lines[mid].startTimeMs - 500;
                if (midTime <= +musicState.position) {
                    result = mid;
                    low = mid + 1;
                } else {
                    high = mid - 1;
                }
            }
            if (result !== -1 && currentLine !== result) {
                console.log(1);
                setCurretLine(result);
            }
            return result;
        }
    }, [musicState.position]);

    return { getCurrentLyricLine, currentLine };
};

export default useSyncLyric;
