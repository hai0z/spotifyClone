import React from "react";
import AppNavigator from "./navigation/index";
import SongProvider from "./context/SongProvider";
import store from "./redux/store";
import { Provider } from "react-redux";
const App = () => {
    return (
        <Provider store={store}>
            <SongProvider>
                <AppNavigator />
            </SongProvider>
        </Provider>
    );
};

export default App;
