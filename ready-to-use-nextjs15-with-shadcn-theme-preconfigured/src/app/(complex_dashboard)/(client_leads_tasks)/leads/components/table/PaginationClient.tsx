"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  // Define page size options
  const pageSizeOptions = [1, 3, 5, 7, 10, 20, 50, 100];

  // Generate page buttons with ellipses
  const getPageNumbers = () => {
    const pages = [];
    const maxButtons = 3; // Show 3 page buttons at a time

    if (totalPages <= 5) {
      // If total pages <= 5, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Determine middle pages and ellipses
      if (currentPage <= 3) {
        // Near start: show 1, 2, 3, ..., last
        pages.push(2, 3);
        if (totalPages > 4) pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near end: show 1, ..., last-2, last-1, last
        pages.push("...");
        pages.push(totalPages - 2, totalPages - 1, totalPages);
      } else {
        // In middle: show 1, ..., current-1, current, current+1, ..., last
        pages.push("...");
        pages.push(currentPage - 1, currentPage, currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      {/* Page Size Selector */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">Rows per page:</span>
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => onPageSizeChange(Number(value))}
        >
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>
      {/* <span className="text-sm font-medium">
        Page {currentPage} of {totalPages}
      </span> */}

      {getPageNumbers().map((page, index) =>
        page === "..." ? (
          <span key={`ellipsis-${index}`} className="text-sm font-medium">
            ...
          </span>
        ) : (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page as number)}
          >
            {page}
          </Button>
        )
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
