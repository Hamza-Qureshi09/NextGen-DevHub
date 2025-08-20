import React, { Suspense } from "react";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LeadFilters as LeadFiltersType, LeadsData } from "@/types/general";
import { getQueryClient } from "@/lib/query-client";
import { fetchActivities, fetchChats } from "@/server/actions";
import { getLeads } from "@/server/test";
import LeadFilters from "./components/filters/LeadFilters.client";
import LeadsTable from "./components/LeadTable";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export const metadata: Metadata = {
  title: "Leads",
  description: "Leads Page Description",
};

async function getFiltersFromSearchParams(
  searchParams: Partial<LeadFiltersType>
): Promise<LeadFiltersType> {
  return {
    page: parseInt(String(searchParams.page) || "1", 10) || 1,
    pageSize: parseInt(String(searchParams.pageSize) || "10", 10) || 10,
    by: searchParams.by || "",
    value: searchParams.value || "",
    date: searchParams.date || "",
    dateRange: Array.isArray(searchParams.dateRange)
      ? searchParams.dateRange
      : [],
    tasksCount: searchParams.tasksCount || "",
    projectInterest: searchParams.projectInterest || "",
    country: searchParams.country || "",
    city: searchParams.city || "",
    lastAllocation: searchParams.lastAllocation || "",
    byTeamAndMembers: Array.isArray(searchParams.byTeamAndMembers)
      ? searchParams.byTeamAndMembers
      : [],
  };
}

type DataResult = {
  initialLeads: LeadsData;
  initialActivities: any[];
  initialChats: any[];
};

export default async function LeadPage({
  searchParams,
}: {
  searchParams: Promise<Partial<LeadFiltersType>>;
}) {
  const cookieStore = await cookies();
  const queryClient = getQueryClient();
  const userCookie = cookieStore.get("access");
  const searchParamsResolved = await searchParams;

  // Step 1: will maintain url based initial filters here
  const initialFilters = await getFiltersFromSearchParams(searchParamsResolved);

  //   // Step 2: will check the auth here
  //   if (!userCookie || userCookie.name !== "access") {
  //     return redirect("/login");
  //   }

  //   // User Session
  //   const userSession = await RscUserSession(userCookie.value, userCookie.name);
  //   if (!userSession || userSession.status === 401) {
  //     return (
  //       <>
  //         <SessionOutPage />
  //       </>
  //     );
  //   }

  // fetch leads data
  const payload = {
    ...initialFilters,
    userId: "123",
  };

  // Prefetch data with error handling
  async function dataFetching(): Promise<DataResult> {
    const [initialLeads, initialActivities, initialChats] = await Promise.all([
      getLeads(payload),
      fetchActivities(payload),
      fetchChats(),
    ]);
    return { initialLeads, initialActivities, initialChats };
  }

  const { initialLeads, initialActivities, initialChats } =
    await dataFetching();

  // Prefetch queries in QueryClient
  queryClient.prefetchQuery({
    queryKey: ["leads", initialFilters],
    queryFn: () => getLeads(payload),
    initialData: initialLeads,
  });

  queryClient.prefetchQuery({
    queryKey: ["activities", initialFilters],
    queryFn: () => fetchActivities(payload),
    initialData: initialActivities,
  });

  queryClient.prefetchQuery({
    queryKey: ["chats"],
    queryFn: fetchChats,
    initialData: initialChats,
  });

  // console.info(
  //   "server side lead page render",
  //   initialLeads,
  //   initialActivities,
  //   initialChats
  // );
  const dehydratedState = dehydrate(queryClient);
  return (
    <>
      <HydrationBoundary state={dehydratedState}>
        <article className="p-6 space-y-6 max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Leads</h1>
          <LeadFilters initialFilters={initialFilters} />
          <LeadsTable initialFilters={initialFilters} />
        </article>
      </HydrationBoundary>
    </>
  );
}
