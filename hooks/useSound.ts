import { PlayerContext } from "./../context/PlayerProvider";
import { useContext } from "react";
function useSound() {
    return useContext(PlayerContext);
}

export default useSound;
