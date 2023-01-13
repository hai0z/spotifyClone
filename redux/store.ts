import { AnyAction, configureStore, ThunkAction } from "@reduxjs/toolkit";
import songSlice from "./songSlice";

const store = configureStore({
    reducer: {
        song: songSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            immutableCheck: false,
            serializableCheck: false,
        }),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    AnyAction
>;
export default store;
