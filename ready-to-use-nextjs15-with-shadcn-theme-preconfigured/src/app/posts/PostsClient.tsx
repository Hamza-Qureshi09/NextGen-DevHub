"use client";

import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchPosts } from "@/server/actions";
import { PostFilters, Post, PostsData } from "@/types/general";
import { useSearchParams } from "next/navigation";
import { PostForm } from "@/components/posts/PostForm";
import { PostFilter } from "@/components/posts/PostFilter";
import { PostList } from "@/components/posts/PostList";
import { Pagination } from "@/components/posts/Pagination";
import { ThemeToggle } from "@/components/shared/theme/theme-toggle";

export function PostsClient({
  initialFilters,
}: {
  initialFilters: PostFilters;
}) {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<PostFilters>({
    page: initialFilters.page || 1,
    pageSize: initialFilters.pageSize || 10,
    category: initialFilters.category || "",
    status: initialFilters.status || "",
    search: initialFilters.search || "",
  });

  // Sync URL with filters without triggering navigation
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.page !== 1) params.set("page", filters?.page.toString());
    if (filters.pageSize !== 10)
      params.set("pageSize", filters.pageSize.toString());
    if (filters.category) params.set("category", filters.category);
    if (filters.status) params.set("status", filters.status);
    if (filters.search) params.set("search", filters.search);

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, "", newUrl);
  }, [filters]);

  // Sync filters with searchParams changes (e.g., back/forward navigation)
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    console.info("2nd effect", searchParams, params);
    const newFilters: PostFilters = {
      page: parseInt(params.get("page") || "1", 10) || 1,
      pageSize: parseInt(params.get("pageSize") || "10", 10) || 10,
      category: params.get("category") || "",
      status: params.get("status") || "",
      search: params.get("search") || "",
    };

    // Only update filters if they differ to prevent infinite loops
    if (
      newFilters.page !== filters.page ||
      newFilters.pageSize !== filters.pageSize ||
      newFilters.category !== filters.category ||
      newFilters.status !== filters.status ||
      newFilters.search !== filters.search
    ) {
      setFilters(newFilters);
    }
  }, [searchParams]);

  const { data, isLoading } = useQuery<PostsData>({
    queryKey: ["posts", filters],
    queryFn: () => fetchPosts(filters),
  });

  if (isLoading) {
    return <div>Loading Posts...</div>;
  }

  return (
    <>
      <ThemeToggle />
      <PostForm filters={filters} />
      <PostFilter filters={filters} setFilters={setFilters} />
      <PostList posts={data?.posts || []} filters={filters} />
      <Pagination
        totalPages={data?.totalPages || 1}
        currentPage={filters.page}
        onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
      />
    </>
  );
}
