// "use client"

import React from "react";
import Link from "next/link";
import { headers } from "next/headers";

const NotFound = async () => {
  const headersList = await headers();
  const domain = headersList.get("host");

  return (
    <>
      <main className="flex h-screen w-full flex-col items-center justify-center bg-gray-100 text-[#1A2238]">
        <h1 className="text-9xl font-extrabold tracking-widest">404</h1>
        <div className="absolute rotate-12 rounded bg-[#FF6A3D] px-2 font-Merriweather text-sm text-white">
          Page Not Found
        </div>
        <button className="mt-5 font-Merriweather">
          <div className="group relative inline-block text-sm font-medium text-[#FF6A3D] focus:outline-none focus:ring active:text-orange-500">
            <span className="absolute inset-0 translate-x-0.5 translate-y-0.5 bg-[#FF6A3D] transition-transform group-hover:translate-x-0 group-hover:translate-y-0"></span>

            <span className="relative block border border-current px-8 py-3 text-white">
              <Link href="/">Return Home</Link>
            </span>
          </div>
        </button>
      </main>
    </>
  );
};

export default NotFound;
