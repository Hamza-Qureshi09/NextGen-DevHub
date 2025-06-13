import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
  resolvedTheme: "light" | "dark";
}

const initialState: ThemeState = {
  theme: "system",
  resolvedTheme: "light",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
    },
    setResolvedTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.resolvedTheme = action.payload;
    },
  },
});

export const { setTheme, setResolvedTheme } = themeSlice.actions;
export default themeSlice.reducer;
