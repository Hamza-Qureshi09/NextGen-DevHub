"use client";

import { Dispatch, SetStateAction } from "react";
import { PostFilters } from "@/types/general";

export function PostFilter({
  filters,
  setFilters,
}: {
  filters: PostFilters;
  setFilters: Dispatch<SetStateAction<PostFilters>>;
}) {
  const handleFilterChange = (name: keyof PostFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 1, // Reset to page 1 on filter change
    }));
  };

  return (
    <div className="flex gap-4 mb-4">
      <select
        value={filters.category}
        onChange={(e) => handleFilterChange("category", e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">All Categories</option>
        <option value="tech">Tech</option>
        <option value="lifestyle">Lifestyle</option>
        <option value="education">Education</option>
      </select>
      <select
        value={filters.status}
        onChange={(e) => handleFilterChange("status", e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">All Statuses</option>
        <option value="published">Published</option>
        <option value="draft">Draft</option>
      </select>
      <input
        type="text"
        value={filters.search}
        onChange={(e) => handleFilterChange("search", e.target.value)}
        placeholder="Search posts..."
        className="border p-2 rounded"
      />
    </div>
  );
}
