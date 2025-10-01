
"use client";
import React, { useState, useEffect } from "react";

export default function FiltersClient({ initialFilters }: { initialFilters?: { name?: string } }) {
    const [name, setName] = useState(initialFilters?.name ?? "");

    // Keep URL-based state without Next hook — use history API so server components won't re-run
    const applyFilters = (p = { name }) => {
        const url = new URL(window.location.href);
        if (p.name) url.searchParams.set("name", p.name);
        else url.searchParams.delete("name");
        url.searchParams.set("page", "1"); // reset to page 1 on filter
        window.history.pushState({}, "", url.toString());
        // dispatch a custom event to tell table to refetch
        window.dispatchEvent(new CustomEvent("leads:filtersChanged"));
    };

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Enter") applyFilters();
        };
        window.addEventListener("keyup", onKey);
        return () => window.removeEventListener("keyup", onKey);
    }, [name]);

    return (
        <div className="mb-4 flex gap-3 items-center">
            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Search name..."
                className="px-3 py-2 border rounded-md w-64"
            />
            <button onClick={() => applyFilters()} className="px-3 py-2 bg-blue-600 text-white rounded-md">Apply</button>
            <button onClick={() => { setName(""); applyFilters({ name: "" }); }} className="px-3 py-2 border rounded-md">Reset</button>
        </div>
    );
}
