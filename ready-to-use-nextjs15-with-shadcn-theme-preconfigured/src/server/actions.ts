// "use server"
// import { mockPosts } from "@/lib/fake-data";
// import { Post, PostFilters } from "@/types/general";



// export async function fetchPosts(filters: PostFilters) {
//     const { page = 1, pageSize = 10, category = "", status = "", search = "" } = filters;

//     let filteredPosts = mockPosts;

//     if (category) {
//         filteredPosts = filteredPosts.filter((post) => post.category === category);
//     }
//     if (status) {
//         filteredPosts = filteredPosts.filter((post) => post.status === status);
//     }
//     if (search) {
//         filteredPosts = filteredPosts.filter((post) =>
//             post.title.toLowerCase().includes(search.toLowerCase())
//         );
//     }

//     const start = (page - 1) * pageSize;
//     const end = start + pageSize;
//     const paginatedPosts = filteredPosts.slice(start, end);
//     const totalPages = Math.ceil(filteredPosts.length / pageSize);

//     return {
//         posts: paginatedPosts || [],
//         totalPages,
//         totalItems: filteredPosts.length,
//     };
// }

// // Omit<Type, Keys> is a utility type that creates a new type by removing some keys from an existing type. here we remove default id and createdAt. Omit → Takes an existing type and removes keys.
// export async function createPost(postData: Omit<Post, "id" | "createdAt">) {
//     const newPost: Post = {
//         id: `post-${mockPosts.length + 1}`,
//         ...postData,
//         createdAt: new Date().toISOString(),
//     };
//     mockPosts.unshift(newPost); // Prepend instead of push
//     return newPost;
// }

// // The Partial<T> utility makes all properties optional. so
// // {
// //   title?: string;
// //   content?: string;
// // }
// // Omit<Post, "id" | "createdAt"> → { title: string; content: string }
// // Partial<Omit<Post, "id" | "createdAt">> → { title?: string; content?: string }
// export async function updatePost(id: string, postData: Partial<Omit<Post, "id" | "createdAt">>) {
//     const index = mockPosts.findIndex((post) => post.id === id);
//     if (index === -1) throw new Error("Post not found");
//     mockPosts[index] = { ...mockPosts[index], ...postData, createdAt: new Date().toISOString() };
//     return mockPosts[index];
// }




"use server";

import { LeadFilters, LeadsData, Post, PostFilters, PostsData } from "@/types/general";

// Mock data store (replace with actual database calls)
let mockPosts: Post[] = Array.from({ length: 30 }, (_, i) => ({
    id: `${i + 1}`,
    title: `Post ${i + 1}`,
    content: `Content for post ${i + 1}`,
    author: `Author ${i + 1}`,
    category: ["tech", "lifestyle", "education"][i % 3] as
        | "tech"
        | "lifestyle"
        | "education",
    status: i % 2 === 0 ? "published" : "draft",
    createdAt: new Date().toISOString(),
}));

export async function fetchPosts(filters: PostFilters): Promise<PostsData> {
    console.info("Server fetchPosts called with filters:", filters);

    const { page = 1, pageSize = 10, category, status, search } = filters;

    // Filter posts
    let filteredPosts = mockPosts;
    if (category) {
        filteredPosts = filteredPosts.filter((post) => post.category === category);
    }
    if (status) {
        filteredPosts = filteredPosts.filter((post) => post.status === status);
    }
    if (search) {
        const searchLower = search.toLowerCase();
        filteredPosts = filteredPosts.filter(
            (post) =>
                post.title.toLowerCase().includes(searchLower) ||
                post.content.toLowerCase().includes(searchLower)
        );
    }

    // Pagination
    const totalItems = filteredPosts.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (page - 1) * pageSize;
    const paginatedPosts = filteredPosts.slice(
        startIndex,
        startIndex + pageSize
    );

    return {
        posts: paginatedPosts,
        totalPages,
        totalItems,
    };
}

export async function createPost(data: Omit<Post, "id" | "createdAt">): Promise<Post> {
    console.info("Server createPost called with data:", data);

    const newPost: Post = {
        id: `${mockPosts.length + 1}`,
        ...data,
        createdAt: new Date().toISOString(),
    };

    mockPosts = [newPost, ...mockPosts]; // Prepend new post
    return newPost;
}

export async function updatePost(
    id: string,
    data: Partial<Omit<Post, "id" | "createdAt">>
): Promise<Post> {
    console.info("Server updatePost called with id:", id, "data:", data);

    const index = mockPosts.findIndex((post) => post.id === id);
    if (index === -1) {
        throw new Error("Post not found");
    }

    const updatedPost = { ...mockPosts[index], ...data };
    mockPosts[index] = updatedPost;
    return updatedPost;
}


// Leads💥💥💥💥
// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
// Dummy data
const DUMMY_LEADS = Array.from({ length: 100 }, (_, i) => ({
    id: `lead-${i + 1}`,
    name: `Lead ${i + 1}`,
    email: `lead${i + 1}@example.com`,
    country: ["USA", "Canada", "UK", "India", "Australia"][i % 5],
    city: ["New York", "Toronto", "London", "Mumbai", "Sydney"][i % 5],
    projectInterest: ["Web Dev", "Mobile App", "AI", "Cloud", "Blockchain"][i % 5],
    tasksCount: Math.floor(Math.random() * 20),
    lastAllocation: ["user1", "user2"][i % 2],
    createdAt: new Date(2024, 0, i + 1).toISOString(),
}));
const DUMMY_ACTIVITIES = Array.from({ length: 50 }, (_, i) => ({
    id: `activity-${i + 1}`,
    type: ["call", "email", "meeting", "task"][i % 4],
    description: `Activity ${i + 1} description`,
    leadId: `lead-${(i % 10) + 1}`,
    createdAt: new Date(2024, 0, i + 1).toISOString(),
}));

const DUMMY_CHATS = Array.from({ length: 20 }, (_, i) => ({
    id: `chat-${i + 1}`,
    message: `Chat message ${i + 1}`,
    sender: ["user", "agent"][i % 2],
    timestamp: new Date(2024, 0, i + 1).toISOString(),
}));
export async function fetchLeads(payload: LeadFilters & { userId: string }): Promise<LeadsData> {
    await delay(1000 + Math.random() * 1000); // 1-2s delay
    const { page, pageSize, country, city, projectInterest, by, value, lastAllocation, byTeamAndMembers } = payload;
    let filteredLeads = DUMMY_LEADS;

    if (country) filteredLeads = filteredLeads.filter(lead => lead.country === country);
    if (city) filteredLeads = filteredLeads.filter(lead => lead.city === city);
    if (projectInterest) filteredLeads = filteredLeads.filter(lead => lead.projectInterest === projectInterest);
    if (lastAllocation) filteredLeads = filteredLeads.filter(lead => lead.lastAllocation === lastAllocation);
    if (byTeamAndMembers.length) filteredLeads = filteredLeads.filter(lead => byTeamAndMembers.includes(lead.lastAllocation));
    if (by === 'name' && value) filteredLeads = filteredLeads.filter(lead => lead.name.toLowerCase().includes(value.toLowerCase()));
    if (by === 'email' && value) filteredLeads = filteredLeads.filter(lead => lead.email.toLowerCase().includes(value.toLowerCase()));

    const startIndex = (page - 1) * pageSize;
    const paginatedLeads = filteredLeads.slice(startIndex, startIndex + pageSize);

    return {
        success: true,
        data: {
            access: true,
            leads: paginatedLeads,
            teamUsers: ["user1", "user2", "user3"],
            hierarchyUsers: ["manager1", "manager2"],
            favLeads: ["lead-1", "lead-5"],
        },
        totalPages: Math.ceil(filteredLeads.length / pageSize),
        totalItems: filteredLeads.length,
    };
}

export async function fetchActivities(filters: LeadFilters & { userId: string }): Promise<any[]> {
    await delay(800 + Math.random() * 700); // 0.8-1.5s delay
    let filteredActivities = DUMMY_ACTIVITIES;

    if (filters.country || filters.city || filters.projectInterest || filters.lastAllocation || filters.byTeamAndMembers.length) {
        const leadIds = DUMMY_LEADS
            .filter(lead => {
                if (filters.country && lead.country !== filters.country) return false;
                if (filters.city && lead.city !== filters.city) return false;
                if (filters.projectInterest && lead.projectInterest !== filters.projectInterest) return false;
                if (filters.lastAllocation && lead.lastAllocation !== filters.lastAllocation) return false;
                if (filters.byTeamAndMembers.length && !filters.byTeamAndMembers.includes(lead.lastAllocation)) return false;
                return true;
            })
            .map(lead => lead.id);

        filteredActivities = filteredActivities.filter(activity => leadIds.includes(activity.leadId));
    }

    return filteredActivities.slice(0, 10);
}

export async function fetchChats(): Promise<any[]> {
    await delay(1200 + Math.random() * 800); // 1.2-2s delay
    return DUMMY_CHATS;
}

export async function fetchCountries(): Promise<string[]> {
    await delay(500 + Math.random() * 500); // 0.5-1s delay
    return ["USA", "Canada", "UK", "India", "Australia"];
}

export async function fetchCities(country?: string): Promise<string[]> {
    await delay(600 + Math.random() * 400); // 0.6-1s delay
    const cityMap: Record<string, string[]> = {
        "USA": ["New York", "Los Angeles", "Chicago"],
        "Canada": ["Toronto", "Vancouver", "Montreal"],
        "UK": ["London", "Manchester", "Birmingham"],
        "India": ["Mumbai", "Delhi", "Bangalore"],
        "Australia": ["Sydney", "Melbourne", "Brisbane"],
    };
    return country ? cityMap[country] || [] : Object.values(cityMap).flat();
}

export async function fetchProjectInterests(): Promise<string[]> {
    await delay(400 + Math.random() * 600); // 0.4-1s delay
    return ["Web Dev", "Mobile App", "AI", "Cloud", "Blockchain"];
}

export async function fetchTeamMembers(): Promise<string[]> {
    await delay(700 + Math.random() * 300); // 0.7-1s delay
    return ["user1", "user2", "user3", "user4"];
}

export async function fetchLastAllocations(): Promise<string[]> {
    await delay(300 + Math.random() * 400); // 0.3-0.7s delay
    return ["user1", "user2", "manager1"];
}

export async function updateLead(leadId: string, data: any): Promise<boolean> {
    await delay(500 + Math.random() * 500);
    console.log(`Updating lead ${leadId}:`, data);
    return true;
}

export async function deleteLead(leadId: string): Promise<boolean> {
    await delay(300 + Math.random() * 400);
    console.log(`Deleting lead ${leadId}`);
    return true;
}


// not used
export async function RsaFetchLeads(filters: LeadFilters & { userId: string }): Promise<LeadsData> {
    console.info("Server fetchleads called with filters:", filters);

    const { page = 1, pageSize = 10, userId, ...restFilters } = filters;

    // Make API Call to server to get lead details

    return {
        success: true,
        totalItems: 100,
        totalPages: 10,
        data: {
            access: { level: 'all' },
            favLeads: ['1', '2', '3'],
            leads: [{ leadId: 1 }, { leadId: 2 }],
            teamUsers: ['1', '2', '3'],
            hierarchyUsers: ['1', '2', '3'],
        }
    };
}
