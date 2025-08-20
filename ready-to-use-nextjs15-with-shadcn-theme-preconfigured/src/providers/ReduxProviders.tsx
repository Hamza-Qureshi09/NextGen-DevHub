"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ReactNode } from "react";

export function ReduxProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider>{children}</ThemeProvider>
    </Provider>
  );
}
