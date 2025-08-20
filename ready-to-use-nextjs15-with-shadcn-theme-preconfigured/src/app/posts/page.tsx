import React from "react";
import { Metadata } from "next";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { fetchPosts } from "@/server/actions";
import { getQueryClient } from "@/lib/query-client";
import { PostsClient } from "./PostsClient";
import { PostFilters } from "@/types/general";

export const metadata: Metadata = {
  title: "Posts",
  description:
    "Paginated and filtered list of posts with server-side prefetching",
};

// Optional: Force static rendering to minimize server re-renders
// export const dynamic = "force-static";

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    category?: string;
    status?: string;
    search?: string;
  }>;
}) {
  console.info("PostsPage rendered at", new Date().toISOString());

  const queryClient = getQueryClient(); // direct usage (new instance per request).
  const searchParamsResolved = await searchParams; // Required in Next.js 15

  const filters: PostFilters = {
    page: parseInt(searchParamsResolved.page || "1", 10) || 1,
    pageSize: parseInt(searchParamsResolved.pageSize || "10", 10) || 10,
    category: searchParamsResolved.category || "",
    status: searchParamsResolved.status || "",
    search: searchParamsResolved.search || "",
  };

  const data = await fetchPosts(filters);
  queryClient.setQueryData(["posts", filters], data);

  console.info("PostsPage prefetchQuery:", data); // Debug prefetch

  return (
    <HydrationBoundary
      state={dehydrate(queryClient, { shouldDehydrateQuery: () => true })}
    >
      <div className="container mx-auto py-10 px-10">
        <h1 className="text-3xl font-bold mb-4">
          Posts with Pagination and Filtering and tanstack react query
        </h1>
        <PostsClient initialFilters={filters} />
      </div>
    </HydrationBoundary>
  );
}
