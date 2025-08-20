"use client";
import { ThemeToggle } from "@/components/shared/theme/theme-toggle";
import React from "react";

export default function CDNavbarClientSide({
  children,
  customProp,
}: {
  children: React.ReactNode;
  customProp: string;
}) {
  // console.info("client side component navbar", customProp);
  return (
    <nav className="z-50 flex h-[70px] w-full flex-row items-center justify-between border-b border-border bg-background text-primary px-2 py-4 font-Figtree capitalize">
      {/* 4,5 static links here */}
      <button>Home</button>
      <button>Products</button>
      <button>About</button>
      <button>Contact</button>
      {/* theme */}
      <ThemeToggle />
      {/* user profile component here which is server side component */}
      {children}
    </nav>
  );
}
