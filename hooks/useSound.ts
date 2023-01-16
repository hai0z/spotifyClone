import { PlayerContext } from "./../context/PlayerProvider";
import { useContext } from "react";
function useSound() {
    const {
        sound,
        onPlayPause,
        onPlaybackStatusUpdate,
        playSound,
        playFromPosition,
        updateLoopingStatus,
    } = useContext(PlayerContext);
    return {
        sound,
        onPlayPause,
        onPlaybackStatusUpdate,
        playSound,
        playFromPosition,
        updateLoopingStatus,
    };
}

export default useSound;
