import { Post } from "@/types/general";

export const mockPosts: Post[] = Array.from({ length: 30 }, (_, i) => ({
    id: `post-${i + 1}`,
    title: `Post Title ${i + 1}`,
    content: `This is the content for post ${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    author: `Author ${Math.floor(i / 10) + 1}`,
    category: ["tech", "lifestyle", "education"][Math.floor(i % 3)] as "tech" | "lifestyle" | "education",
    status: i % 2 === 0 ? "published" : "draft",
    createdAt: new Date(2025, 7, 1 - i).toISOString(),
}));