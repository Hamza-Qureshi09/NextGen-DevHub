// app/page.tsx  (Server Component)
import React from "react";
import LeadsTableClient from "./components/LeadsTableClient";
import FiltersClient from "./components/FiltersClient";

type Lead = {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    createdAt: string;
};

async function fetchLeadsFromAPI(searchParamsStr: string) {
    const base = "http://localhost:4000";

    // server-side fetch to own API route with ISR (revalidate)
    const url = `${base}/api/test-leads?${searchParamsStr}`;
    const res = await fetch(url, { next: { revalidate: 60 } }); // ISR: revalidate every 60s
    if (!res.ok) throw new Error("Failed to fetch leads");
    const json = await res.json();
    return json as { data: Lead[]; total: number; page: number; pageSize: number };
}

export default async function TestLeadsPage({ searchParams }: { searchParams: Promise<any> }) {
    // next15: searchParams can be a promise — resolve it
    const resolved = await searchParams;
    const page = resolved.page ?? "1";
    const pageSize = resolved.pageSize ?? "10";
    const name = resolved.name ?? "";
    const filters = new URLSearchParams({ page, pageSize, name }).toString();

    // server fetch initial data with ISR/caching
    let initialData: unknown = { data: [], total: 0, page: Number(page), pageSize: Number(pageSize) };
    try {
        initialData = await fetchLeadsFromAPI(filters);
    } catch (e) {
        console.error("initial fetch failed", e);
    }

    return (
        <main className="p-6 bg-slate-50 min-h-screen">
            <div className="max-w-full mx-auto">
                <h1 className="text-2xl font-bold mb-4">Test Leads</h1>

                {/* Filters (client) - uses URL-based state */}
                <FiltersClient initialFilters={{ name: name as string }} />

                {/* Use React.Suspense around the client table to show fallback while loading */}
                <React.Suspense fallback={<div className="mt-4">Loading table...</div>}>
                    {/* Pass initialData down for hydration/placeholder usage */}
                    {/* The table is a client component using React Query */}
                    {/* @ts-ignore */}
                    <LeadsTableClient serverInitial={initialData} />
                </React.Suspense>
            </div>
        </main>
    );
}
