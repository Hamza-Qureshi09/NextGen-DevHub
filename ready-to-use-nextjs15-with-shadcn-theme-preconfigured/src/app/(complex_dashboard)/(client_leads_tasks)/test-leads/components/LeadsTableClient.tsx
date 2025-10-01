"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    QueryClient,
    QueryClientProvider,
    useQuery,
    useQueryClient,
    HydrationBoundary,
    dehydrate,
} from "@tanstack/react-query"; // v5
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

type Lead = {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    createdAt: string;
};
type ServerInitial = {
    data: Lead[];
    total: number;
    page: number;
    pageSize: number;
};

const queryClient = new QueryClient();

async function fetchLeads({
    page = 1,
    pageSize = 10,
    name = "",
}: {
    page?: number;
    pageSize?: number;
    name?: string;
}) {
    const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
    });
    if (name) params.set("name", name);
    const url = `/api/test-leads?${params.toString()}`;
    const res = await axios.get(url);
    return res.data as {
        data: Lead[];
        total: number;
        page: number;
        pageSize: number;
    };
}

function useLeads(
    page: number,
    pageSize: number,
    name: string,
    serverInitial?: ServerInitial,
) {
    const key = ["leads", { page, pageSize, name }];

    return useQuery({
        queryKey: key,
        queryFn: () => fetchLeads({ page, pageSize, name }),
        placeholderData: (prev) => prev ?? serverInitial,
        staleTime: 10 * 1000,
    });
}

export default function LeadsTableClient({
    serverInitial,
}: {
    serverInitial?: ServerInitial;
}) {
    // dehydrate for hydration boundary
    const dehydratedState = dehydrate(queryClient);

    return (
        <QueryClientProvider client={queryClient}>
            <HydrationBoundary state={dehydratedState}>
                <LeadsTableInner serverInitial={serverInitial} />
            </HydrationBoundary>
        </QueryClientProvider>
    );
}

function LeadsTableInner({ serverInitial }: { serverInitial?: ServerInitial }) {
    // read URL-based state on client
    const url = typeof window !== "undefined" ? new URL(window.location.href) : null;
    const initialPage = url ? Number(url.searchParams.get("page") ?? 1) : serverInitial?.page ?? 1;
    const initialPageSize = url ? Number(url.searchParams.get("pageSize") ?? 10) : serverInitial?.pageSize ?? 10;
    const initialName = url ? url.searchParams.get("name") ?? "" : "";

    const [page, setPage] = useState<number>(initialPage);
    const [pageSize] = useState<number>(initialPageSize);
    const [name, setName] = useState<string>(initialName);

    const { data, isFetching, refetch } = useLeads(page, pageSize, name, serverInitial);

    // listen to filter changes
    useEffect(() => {
        const handler = async () => {
            const u = new URL(window.location.href);
            setPage(Number(u.searchParams.get("page") ?? 1));
            setName(u.searchParams.get("name") ?? "");
            await refetch();
        };
        window.addEventListener("leads:filtersChanged", handler);
        return () => window.removeEventListener("leads:filtersChanged", handler);
    }, [refetch]);

    // pagination logic
    const total = data?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const qc = useQueryClient();

    useEffect(() => {
        if (page < totalPages) {
            qc.prefetchQuery({
                queryKey: ["leads", { page: page + 1, pageSize, name }],
                queryFn: () => fetchLeads({ page: page + 1, pageSize, name }),
            });
        }
    }, [page, pageSize, name, totalPages, qc]);

    const onGotoPage = (p: number) => {
        setPage(p);
        const u = new URL(window.location.href);
        u.searchParams.set("page", String(p));
        window.history.pushState({}, "", u.toString());
        window.dispatchEvent(new CustomEvent("leads:filtersChanged"));
    };

    const onView = (id: string) => {
        window.open(`/leads/${id}`, "_blank");
    };

    return (
        <div className="bg-white rounded-md shadow p-4 mt-4">
            <div className="flex justify-between items-center mb-2">
                <div className="text-sm text-slate-600">
                    {isFetching ? "Updating..." : `Page ${page} of ${totalPages}`}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead>
                        <tr className="text-left">
                            <th className="px-3 py-2">#</th>
                            <th className="px-3 py-2">Name</th>
                            <th className="px-3 py-2">Email</th>
                            <th className="px-3 py-2">Phone</th>
                            <th className="px-3 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.data?.map((lead, i) => (
                            <tr key={lead._id} className="border-b">
                                <td className="px-3 py-2">{(page - 1) * pageSize + i + 1}</td>
                                <td className="px-3 py-2">{lead.name}</td>
                                <td className="px-3 py-2">{lead.email}</td>
                                <td className="px-3 py-2">{lead.phone}</td>
                                <td className="px-3 py-2">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onView(lead._id)}
                                            className="px-2 py-1 bg-slate-100 rounded"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => alert("Perform action...")}
                                            className="px-2 py-1 bg-slate-100 rounded"
                                        >
                                            Action
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-3 flex items-center justify-between">
                <div className="text-sm text-slate-600">Total: {total}</div>
                <div className="flex items-center gap-2">
                    <button
                        disabled={page <= 1}
                        onClick={() => onGotoPage(page - 1)}
                        className="p-1 border rounded disabled:opacity-50"
                    >
                        <ChevronLeftIcon className="w-4 h-4" />
                    </button>
                    <div>{page}</div>
                    <button
                        disabled={page >= totalPages}
                        onClick={() => onGotoPage(page + 1)}
                        className="p-1 border rounded disabled:opacity-50"
                    >
                        <ChevronRightIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
