import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { ISong } from "../types/song";

const useSyncLyric = (song: ISong) => {
    const [currentLine, setCurretLine] = useState<number | undefined>();

    const { musicState } = useSelector((state: RootState) => state.song);

    const getCurrentLyricLine = useMemo(() => {
        if (song?.lyrics) {
            let low = 0;
            let high = song?.lyrics?.lines?.length - 1;
            let result = -1;

            while (low <= high) {
                const mid = Math.floor((low + high) / 2);
                const midTime = +song.lyrics.lines[mid].startTimeMs - 750;
                if (midTime <= +musicState.position) {
                    result = mid;
                    low = mid + 1;
                } else {
                    high = mid - 1;
                }
            }

            if (result !== -1 && currentLine !== result) {
                setCurretLine(result);
                console.log(1);
            }

            return result;
        }
    }, [musicState.position]);

    return { getCurrentLyricLine, currentLine };
};

export default useSyncLyric;
