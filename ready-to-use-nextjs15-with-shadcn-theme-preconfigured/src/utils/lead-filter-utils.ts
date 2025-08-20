import { LeadFilters } from '@/types/general';

export const DEFAULT_FILTERS: LeadFilters = {
    page: 1,
    pageSize: 10,
    by: "",
    value: "",
    date: "",
    dateRange: [],
    tasksCount: "",
    projectInterest: "",
    country: "",
    city: "",
    lastAllocation: "",
    byTeamAndMembers: [],
};

export const parseFiltersFromSearchParams = (searchParams: URLSearchParams): LeadFilters => {
    try {
        return {
            page: Math.max(1, parseInt(searchParams.get("page") || "1", 10)),
            pageSize: Math.max(1, parseInt(searchParams.get("pageSize") || "10", 10)),
            by: searchParams.get("by") || "",
            value: searchParams.get("value") || "",
            date: searchParams.get("date") || "",
            dateRange: searchParams.get("dateRange")
                ? JSON.parse(searchParams.get("dateRange")!)
                : [],
            tasksCount: searchParams.get("tasksCount") || "",
            projectInterest: searchParams.get("projectInterest") || "",
            country: searchParams.get("country") || "",
            city: searchParams.get("city") || "",
            lastAllocation: searchParams.get("lastAllocation") || "",
            byTeamAndMembers: searchParams.get("byTeamAndMembers")
                ? JSON.parse(searchParams.get("byTeamAndMembers")!)
                : [],
        };
    } catch (error) {
        console.error("Error parsing filters from URL:", error);
        return DEFAULT_FILTERS;
    }
};

export const buildSearchParams = (filters: LeadFilters): URLSearchParams => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "" && !(key === "page" && value === 1) && !(key === "pageSize" && value === 10)) {
            if (Array.isArray(value) && value.length > 0) {
                params.set(key, JSON.stringify(value));
            } else if (!Array.isArray(value)) {
                params.set(key, String(value));
            }
        }
    });

    return params;
};

export const updateURL = (filters: LeadFilters) => {
    if (typeof window === "undefined") return;

    const params = buildSearchParams(filters);
    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.replaceState({}, "", newUrl);
};
