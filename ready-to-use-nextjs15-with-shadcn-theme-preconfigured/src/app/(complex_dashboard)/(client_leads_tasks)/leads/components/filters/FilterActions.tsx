"use client";
import { memo } from "react";

// FilterActions component
export const FilterActions = memo(
  ({ onSearch, onClear }: { onSearch: () => void; onClear: () => void }) => (
    <div className="flex gap-2">
      <button
        onClick={onSearch}
        className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
        type="button"
      >
        Search
      </button>
      <button
        onClick={onClear}
        className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
        type="button"
      >
        Clear All Filters
      </button>
    </div>
  )
);
