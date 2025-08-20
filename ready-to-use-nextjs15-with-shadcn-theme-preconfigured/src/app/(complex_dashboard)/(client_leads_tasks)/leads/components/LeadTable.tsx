"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { LeadFilters, LeadsData } from "@/types/general";
import { useQuery } from "@tanstack/react-query";
import { getLeads } from "@/server/test";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "./table/PaginationClient";
import LeadTableRow from "./table/LeadTableRow";
import {
  parseFiltersFromSearchParams,
  buildSearchParams,
} from "@/utils/lead-filter-utils";
import { Loader2 } from "lucide-react";

export default function LeadsTable({
  initialFilters,
}: {
  initialFilters: LeadFilters;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<LeadFilters>(initialFilters);

  useEffect(() => {
    const newFilters = parseFiltersFromSearchParams(searchParams);
    if (JSON.stringify(newFilters) !== JSON.stringify(filters)) {
      setFilters(newFilters);
    }
  }, [searchParams]);

  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch, // ✅ manual refetch
  } = useQuery({
    queryKey: ["leads", filters],
    queryFn: () => getLeads({ ...filters, userId: "123" }),
    placeholderData: (prev) => prev, // ✅ keep showing old data

    // --- Control Refetch Behavior ---
    refetchOnWindowFocus: false, // 🚫 don’t refetch when switching tabs
    refetchOnReconnect: true, // ✅ refetch when internet reconnects
    refetchOnMount: true, // ✅ refetch every time component mounts
    refetchInterval: false, // 🚫 no polling (can set ms if you want auto refresh)

    // --- Cache & Freshness ---
    staleTime: 1000 * 30, // ✅ 30 sec fresh (no refetch if revisiting soon)
    gcTime: 1000 * 60 * 1.5, // ✅ cache garbage collect after 5 mins unused

    // --- Retry Behavior ---
    retry: 2, // ✅ retry 2 times on failure
    retryDelay: 2000, // ✅ wait 2s before retry
  });

  // Handle page change
  const handlePageChange = (newPage: number) => {
    const newFilters = { ...filters, page: newPage };
    setFilters(newFilters);
    const params = buildSearchParams(newFilters);
    router.push(`/leads?${params.toString()}`);
  };

  // Handle page size change
  const handlePageSizeChange = (newPageSize: number) => {
    const newFilters = {
      ...filters,
      pageSize: newPageSize,
      page: 1,
    }; // Reset to page 1 on page size change
    setFilters(newFilters);
    const params = buildSearchParams(newFilters);
    router.push(`/leads?${params.toString()}`);
  };

  // Render loading state for initial load
  if (!data && isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading leads...</span>
      </div>
    );
  }

  // Empty state
  if (!data || !data.success || !data.data?.leads?.length) {
    return <div className="p-4">No leads found</div>;
  }

  if (error instanceof Error) {
    return <div className="p-4 text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Tasks Count</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="relative">
          {/* overlay spinner while fetching */}
          {isFetching && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}
          {data.data.leads.map((lead) => (
            <LeadTableRow
              key={lead.id}
              lead={lead}
              filters={filters}
              refetch={refetch}
            />
          ))}
        </TableBody>
      </Table>
      <Pagination
        currentPage={filters.page}
        totalPages={data.totalPages}
        pageSize={filters.pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}
