import { useMemo } from "react";

enum COLOR {
    WHITE = "#3cb37160",
    CORAL = "#6667AB95",
    INDIGO = "#33009970",
}
const useHeaderColor = () => {
    const timeNow = new Date().getHours();

    const color = useMemo(() => {
        return timeNow >= 5 && timeNow < 12
            ? COLOR.WHITE
            : timeNow >= 12 && timeNow < 17
            ? COLOR.CORAL
            : COLOR.INDIGO;
    }, []);
    return color;
};
export default useHeaderColor;
