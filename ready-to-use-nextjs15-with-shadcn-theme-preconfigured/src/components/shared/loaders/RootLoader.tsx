"use client";

import { useAppSelector } from "@/store/hooks";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function RootLoading() {
  const { resolvedTheme } = useAppSelector((state) => state.theme);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2
        className={cn(
          "h-8 w-8 animate-spin",
          resolvedTheme === "dark" ? "text-white" : "text-gray-900"
        )}
      />
    </div>
  );
}
