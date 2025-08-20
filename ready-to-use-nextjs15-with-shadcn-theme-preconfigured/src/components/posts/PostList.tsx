"use client";

import { useState } from "react";
import { Post, PostFilters } from "@/types/general";
import { PostForm } from "./PostForm";

export function PostList({
  posts,
  filters,
}: {
  posts: Post[];
  filters: PostFilters;
}) {
  const [selectedPost, setSelectedPost] = useState<Post | undefined>(undefined);

  console.info("PostList client data:", posts);

  return (
    <div>
      {selectedPost && (
        <div className="mb-4">
          <PostForm
            initialData={selectedPost}
            filters={filters}
            key={selectedPost.id}
          />
          <button
            onClick={() => setSelectedPost(undefined)}
            className="bg-gray-500 text-white px-4 py-2 rounded mt-2"
          >
            Cancel Edit
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.id}
              className="border p-4 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setSelectedPost(post)}
            >
              <h2 className="text-xl font-bold">{post.title}</h2>
              <p className="text-gray-600">{post.content}</p>
              <p className="text-sm">
                By {post.author} | {post.category} | {post.status}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No posts found.</p>
        )}
      </div>
    </div>
  );
}
