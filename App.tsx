import React from "react";
import AppNavigator from "./navigation/index";
import SongProvider from "./context/SongProvider";
import store from "./redux/store";
import { Provider } from "react-redux";
import PlayerProvider from "./context/PlayerProvider";
import AnimationProvider from "./context/AnimationProvider";
const App = () => {
    return (
        <Provider store={store}>
            <SongProvider>
                <PlayerProvider>
                    <AnimationProvider>
                        <AppNavigator />
                    </AnimationProvider>
                </PlayerProvider>
            </SongProvider>
        </Provider>
    );
};

export default App;
