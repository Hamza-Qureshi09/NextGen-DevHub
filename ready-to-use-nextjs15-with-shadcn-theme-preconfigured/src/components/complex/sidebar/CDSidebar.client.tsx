"use client";
import Link from "next/link";
import React from "react";

export default function CDSideBar({ customProps }: { customProps?: any }) {
  // here maintain toggle system of sidebar open & off
  // console.info("client side sidebar", customProps);
  return (
    <aside className="h-screen w-20 bg-background border border-r-border border-t-0">
      {/* sidebar holding links */}
      {customProps?.linksList?.map(
        (l: { link: string; text: string }, index: number) => {
          return (
            <Link href={l.link} key={index} className="block mt-2">
              {l.text}
            </Link>
          );
        }
      )}
    </aside>
  );
}
