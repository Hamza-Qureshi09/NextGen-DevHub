// "use client";

// import dynamic from "next/dynamic";
// import { LeadFilters } from "@/types/general";
// import React, { useEffect, useRef, useState } from "react";
// import {
//   BySelect,
//   ValueInput,
// } from "@/app/(complex_dashboard)/(client_leads_tasks)/leads/components/filters/SearchFilter";
// import { TasksCountInput } from "@/app/(complex_dashboard)/(client_leads_tasks)/leads/components/filters/TasksCountFilter";
// import { FilterActions } from "@/app/(complex_dashboard)/(client_leads_tasks)/leads/components/filters/FilterActions";

// const CountrySelect = dynamic(
//   () =>
//     import(
//       "@/app/(complex_dashboard)/(client_leads_tasks)/leads/components/filters/CountryFilter"
//     ),
//   {
//     ssr: false,
//     loading: () => (
//       <div className="p-2 border rounded">Loading countries main...</div>
//     ),
//   }
// );
// const CitySelect = dynamic(
//   () =>
//     import(
//       "@/app/(complex_dashboard)/(client_leads_tasks)/leads/components/filters/CityFilter"
//     ),
//   {
//     ssr: false,
//     loading: () => (
//       <div className="p-2 border rounded">Loading cities main...</div>
//     ),
//   }
// );
// const ProjectSelect = dynamic(
//   () =>
//     import(
//       "@/app/(complex_dashboard)/(client_leads_tasks)/leads/components/filters/ProjectInterestFilter"
//     ),
//   {
//     ssr: false,
//     loading: () => (
//       <div className="p-2 border rounded">Loading cities main...</div>
//     ),
//   }
// );

// // Create default filters
// const createInitialFilters = (): LeadFilters => ({
//   page: 1,
//   pageSize: 10,
//   by: "",
//   value: "",
//   date: "",
//   dateRange: [],
//   tasksCount: "",
//   projectInterest: "",
//   country: "",
//   city: "",
//   lastAllocation: "",
//   byTeamAndMembers: [],
// });

// // Parse filters from URL
// const parseFiltersFromURL = (): LeadFilters => {
//   if (typeof window === "undefined") return createInitialFilters();
//   const params = new URLSearchParams(window.location.search);
//   let filters = createInitialFilters();
//   try {
//     filters = {
//       page: parseInt(params.get("page") || "1", 10) || 1,
//       pageSize: parseInt(params.get("pageSize") || "10", 10) || 10,
//       by: params.get("by") || "",
//       value: params.get("value") || "",
//       date: params.get("date") || "",
//       dateRange: params.get("dateRange")
//         ? JSON.parse(params.get("dateRange") as string)
//         : [],
//       tasksCount: params.get("tasksCount") || "",
//       projectInterest: params.get("projectInterest") || "",
//       country: params.get("country") || "",
//       city: params.get("city") || "",
//       lastAllocation: params.get("lastAllocation") || "",
//       byTeamAndMembers: params.get("byTeamAndMembers")
//         ? JSON.parse(params.get("byTeamAndMembers") as string)
//         : [],
//     };
//   } catch (error) {
//     console.error("Error parsing URL filters:", error);
//   }
//   return filters;
// };

// // Update URL with filters
// const updateURL = (filters: LeadFilters) => {
//   if (typeof window === "undefined") return;
//   const params = new URLSearchParams();
//   Object.entries(filters).forEach(([key, value]) => {
//     if (value && value !== "" && value !== 1 && value !== 10) {
//       if (Array.isArray(value) && value.length > 0) {
//         params.set(key, JSON.stringify(value));
//       } else if (!Array.isArray(value)) {
//         params.set(key, String(value));
//       }
//     }
//   });
//   const newUrl = `${window.location.pathname}?${params.toString()}`;
//   window.history.pushState({}, "", newUrl);
// };

// const MainPage = ({ initialFilters }: { initialFilters: LeadFilters }) => {
//   console.info("Filters render - should only render once or on search/clear");

//   const filterValuesRef = useRef<LeadFilters>({
//     ...createInitialFilters(),
//     ...initialFilters,
//   });
//   const [confirmedFilters, setConfirmedFilters] =
//     useState<LeadFilters>(initialFilters);
//   const [resetKey, setResetKey] = useState(0);

//   // Load filters from URL on mount
//   useEffect(() => {
//     const urlFilters = parseFiltersFromURL();
//     filterValuesRef.current = urlFilters;
//     setConfirmedFilters(urlFilters);
//     console.info("Filters loaded from URL:", urlFilters);
//   }, []);

//   // Update filter values without re-rendering
//   const handleFilterChange = (
//     key: keyof LeadFilters,
//     value: LeadFilters[keyof LeadFilters]
//   ) => {
//     filterValuesRef.current = { ...filterValuesRef.current, [key]: value };
//     console.info(`Filter changed: ${key} = ${value}`);
//   };

//   // Apply filters and update URL
//   const handleSearch = () => {
//     setConfirmedFilters({ ...filterValuesRef.current });
//     updateURL(filterValuesRef.current);
//     console.info("Search clicked, URL updated:", filterValuesRef.current);
//   };

//   // Clear filters and reset components
//   const handleClear = () => {
//     const clearedFilters = createInitialFilters();
//     filterValuesRef.current = clearedFilters;
//     setConfirmedFilters(clearedFilters);
//     setResetKey((prev) => prev + 1);
//     updateURL(clearedFilters);
//     console.info("Filters cleared");
//   };

//   return (
//     <div>
//       Filters
//       <CountrySelect
//         value={filterValuesRef.current.country}
//         onChange={(value) => handleFilterChange("country", value)}
//         key={`country-${resetKey}`}
//       />
//       <CitySelect
//         value={filterValuesRef.current.city}
//         onChange={(value) => handleFilterChange("city", value)}
//         key={`city-${resetKey}`}
//       />
//       <ProjectSelect
//         value={filterValuesRef.current.projectInterest}
//         onChange={(value) => handleFilterChange("projectInterest", value)}
//         key={`project-${resetKey}`}
//       />
//       <BySelect
//         value={filterValuesRef.current.by}
//         onChange={(value) => handleFilterChange("by", value)}
//         key={`by-${resetKey}`}
//       />
//       <ValueInput
//         value={filterValuesRef.current.value}
//         onChange={(value) => handleFilterChange("value", value)}
//         key={`value-${resetKey}`}
//       />
//       <TasksCountInput
//         value={filterValuesRef.current.tasksCount}
//         onChange={(value) => handleFilterChange("tasksCount", value)}
//         key={`tasksCount-${resetKey}`}
//       />
//       <FilterActions onSearch={handleSearch} onClear={handleClear} />
//     </div>
//   );
// };

// export default MainPage;
