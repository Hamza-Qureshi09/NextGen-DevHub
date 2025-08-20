import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./slices/theme-slice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
  },
  devTools:true
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
