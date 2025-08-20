// actions.ts
"use server";

import { Lead, LeadFilters, LeadsData } from "@/types/general";

export async function getCountries() {
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Fake delay
    return ["USA", "Canada", "Mexico", "Brazil", "Argentina"];
}

export async function getCities() {
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Fake delay
    return ["New York", "Toronto", "Mexico City", "Sao Paulo", "Buenos Aires", "Los Angeles", "Vancouver"];
}

export async function getProjects() {
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Fake delay
    return ["Project A", "Project B", "Project C", "Project D", "Project E"];
}

let allLeads: Lead[] = [
    { id: 1, name: "Lead 1", email: "lead1@example.com", country: "USA", city: "New York", project: "Project A", tasksCount: "5", value: "1000" },
    { id: 2, name: "Lead 2", email: "lead2@example.com", country: "Canada", city: "Toronto", project: "Project B", tasksCount: "3", value: "1500" },
    { id: 3, name: "Lead 3", email: "lead3@example.com", country: "Mexico", city: "Mexico City", project: "Project C", tasksCount: "7", value: "2000" },
    { id: 4, name: "Lead 4", email: "lead4@example.com", country: "Brazil", city: "Sao Paulo", project: "Project D", tasksCount: "2", value: "800" },
    { id: 5, name: "Lead 5", email: "lead5@example.com", country: "Argentina", city: "Buenos Aires", project: "Project E", tasksCount: "4", value: "1200" },
    { id: 6, name: "Lead 6", email: "lead6@example.com", country: "USA", city: "Los Angeles", project: "Project A", tasksCount: "6", value: "1100" },
    { id: 7, name: "Lead 7", email: "lead7@example.com", country: "Canada", city: "Vancouver", project: "Project B", tasksCount: "3", value: "1400" },
    { id: 8, name: "Lead 8", email: "lead8@example.com", country: "Mexico", city: "Mexico City", project: "Project C", tasksCount: "8", value: "2200" },
    { id: 9, name: "Lead 9", email: "lead9@example.com", country: "Brazil", city: "Sao Paulo", project: "Project D", tasksCount: "1", value: "900" },
    { id: 10, name: "Lead 10", email: "lead10@example.com", country: "Argentina", city: "Buenos Aires", project: "Project E", tasksCount: "5", value: "1300" },
];

export async function getLeads(payload: Partial<LeadFilters> & { userId: string }): Promise<LeadsData> {
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Fake delay

    let filteredLeads = allLeads;

    if (payload.country) filteredLeads = filteredLeads.filter((lead) => lead.country === payload.country);
    if (payload.city) filteredLeads = filteredLeads.filter((lead) => lead.city === payload.city);
    if (payload.projectInterest) filteredLeads = filteredLeads.filter((lead) => lead.project === payload.projectInterest);
    if (payload.tasksCount) filteredLeads = filteredLeads.filter((lead) => lead.tasksCount === payload.tasksCount);
    if (payload.value) filteredLeads = filteredLeads.filter((lead) => lead.value === payload.value);

    if (payload.by === "name" && payload.value) {
        filteredLeads = filteredLeads.filter((lead) =>
            lead.name.toLowerCase().includes(payload.value?.toLowerCase() ?? "")
        );
    }

    if (payload.by === "email" && payload.value) {
        filteredLeads = filteredLeads.filter((lead) =>
            lead.email.toLowerCase().includes(payload.value?.toLowerCase() ?? "")
        );
    }

    const page = payload.page || 1;
    const pageSize = payload.pageSize || 10;
    const start = (page - 1) * pageSize;
    const paginatedLeads = filteredLeads.slice(start, start + pageSize);

    return {
        success: true,
        data: {
            access: 'all',
            leads: paginatedLeads,
            teamUsers: ['user1', 'user2'],
            hierarchyUsers: ['user1', 'user2', 'user3'],
            favLeads: ['lead1', 'lead2'],
        },
        totalItems: filteredLeads.length,
        totalPages: Math.ceil(filteredLeads.length / pageSize),
    };
}

export async function updateLead(id: number, updates: Partial<Lead>) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    allLeads = allLeads.map((lead) => (lead.id === id ? { ...lead, ...updates } : lead));
    return { id, ...updates };
}

export async function deleteLead(id: number) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    allLeads = allLeads.filter((lead) => lead.id !== id);
    return id;
}