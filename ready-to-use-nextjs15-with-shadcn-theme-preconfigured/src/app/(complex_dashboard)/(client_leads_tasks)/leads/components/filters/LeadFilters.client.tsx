"use client";

import { useEffect, useRef, useState } from "react";
import { LeadFilters as LeadFiltersTypes } from "@/types/general";
import CountryFilter from "./CountryFilter";
import CityFilter from "./CityFilter";
import ProjectInterestFilter from "./ProjectInterestFilter";
import { BySelect, ValueInput } from "./SearchFilter";
import { TasksCountFilter } from "./TasksCountFilter";
import { FilterActions } from "./FilterActions";
import {
  DEFAULT_FILTERS,
  parseFiltersFromSearchParams,
  updateURL,
} from "@/utils/lead-filter-utils";

// Main Filters component
export default function LeadFilters({
  initialFilters,
}: {
  initialFilters: LeadFiltersTypes;
}) {
  // console.info("Filters render - should only render once or on search/clear");

  const filterValuesRef = useRef<LeadFiltersTypes>({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  });
  const [confirmedFilters, setConfirmedFilters] =
    useState<LeadFiltersTypes>(initialFilters);
  const [resetKey, setResetKey] = useState(0);

  // Load filters from URL on mount
  useEffect(() => {
    const urlFilters = parseFiltersFromSearchParams(
      new URLSearchParams(window.location.search)
    );
    filterValuesRef.current = urlFilters;
    setConfirmedFilters(urlFilters);
    console.info("Filters loaded from URL:", urlFilters);
  }, []);

  // Update filter values without re-rendering
  const handleFilterChange = (
    key: keyof LeadFiltersTypes,
    value: LeadFiltersTypes[keyof LeadFiltersTypes]
  ) => {
    filterValuesRef.current = { ...filterValuesRef.current, [key]: value };
    // console.info(`Filter changed: ${key} = ${value}`);
  };

  // Apply filters and update URL
  const handleSearch = () => {
    setConfirmedFilters({ ...filterValuesRef.current });
    updateURL(filterValuesRef.current);
    // console.info("Search clicked, URL updated:", filterValuesRef.current);
  };

  // Clear filters and reset components
  const handleClear = () => {
    const clearedFilters = DEFAULT_FILTERS;
    filterValuesRef.current = clearedFilters;
    setConfirmedFilters(clearedFilters);
    setResetKey((prev) => prev + 1);
    updateURL(clearedFilters);
    // console.info("Filters cleared");
  };

  return (
    <div>
      <CountryFilter
        value={filterValuesRef.current.country}
        onChange={(value) => handleFilterChange("country", value)}
        key={`country-${resetKey}`}
      />
      <CityFilter
        value={filterValuesRef.current.city}
        onChange={(value) => handleFilterChange("city", value)}
        key={`city-${resetKey}`}
      />
      <ProjectInterestFilter
        value={filterValuesRef.current.projectInterest}
        onChange={(value) => handleFilterChange("projectInterest", value)}
        key={`project-${resetKey}`}
      />
      <BySelect
        value={filterValuesRef.current.by}
        onChange={(value) => handleFilterChange("by", value)}
        key={`by-${resetKey}`}
      />
      <ValueInput
        value={filterValuesRef.current.value}
        onChange={(value) => handleFilterChange("value", value)}
        key={`value-${resetKey}`}
      />
      <TasksCountFilter
        value={filterValuesRef.current.tasksCount}
        onChange={(value) => handleFilterChange("tasksCount", value)}
        key={`tasksCount-${resetKey}`}
      />
      <FilterActions onSearch={handleSearch} onClear={handleClear} />
    </div>
  );
}
