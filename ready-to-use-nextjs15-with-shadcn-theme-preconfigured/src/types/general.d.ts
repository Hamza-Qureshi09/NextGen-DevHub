export interface Post {
    id: string;
    title: string;
    content: string;
    author: string;
    category: "tech" | "lifestyle" | "education";
    status: "draft" | "published";
    createdAt: string;
}

export interface PostFilters {
    page: number; // Required, no longer optional
    pageSize: number; // Required, no longer optional
    category?: string;
    status?: string;
    search?: string;
}


export type PostsData = {
    posts: Post[];
    totalPages: number;
    totalItems: number;
};




export interface LeadFilters {
    page: number;
    pageSize: number;
    by: string;
    value: string;
    date: string;
    dateRange: string[];
    tasksCount: string;
    projectInterest: string;
    country: string;
    city: string;
    lastAllocation: string;
    byTeamAndMembers: string[];
}

export interface Lead {
    id: number;
    name: string;
    email: string;
    country: string;
    city: string;
    project: string;
    tasksCount: string;
    value: string;
}

export type LeadsData = {
    success: boolean;
    data: {
        access: any;
        leads: any[];
        teamUsers: string[];
        hierarchyUsers: string[];
        favLeads: string[];
    };
    totalPages: number;
    totalItems: number;
};