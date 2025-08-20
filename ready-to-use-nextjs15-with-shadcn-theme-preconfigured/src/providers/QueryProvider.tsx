"use client";

import { getQueryClient } from "@/lib/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { cache, ReactNode } from "react";

// using `cache` to create a singleton QueryClient, preventing re-instantiation on re-renders or across server/client boundaries.
const getClientQueryClient = cache(getQueryClient);

export function TanStackQueryProvider({ children }: { children: ReactNode }) {
  const queryClient = getClientQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="top-right" />
    </QueryClientProvider>
  );
}
