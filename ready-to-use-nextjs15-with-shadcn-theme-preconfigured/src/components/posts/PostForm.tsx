"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost, updatePost } from "@/server/actions";
import { Post, PostFilters, PostsData } from "@/types/general";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const postSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, "Title must be at least 2 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  author: z.string().min(2, "Author must be at least 2 characters"),
  category: z.enum(["tech", "lifestyle", "education"], {
    message: "Invalid category",
  }),
  status: z.enum(["draft", "published"], { message: "Invalid status" }),
});

type PostFormData = z.infer<typeof postSchema>;

export function PostForm({
  initialData,
  filters,
}: {
  initialData?: Post;
  filters?: PostFilters;
}) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: initialData || {
      title: "",
      content: "",
      author: "",
      category: "tech",
      status: "draft",
    },
  });

  const createMutation = useMutation({
    mutationFn: createPost,
    onMutate: async (newPost) => {
      await queryClient.cancelQueries({ queryKey: ["posts", filters] }); // it Doesn’t delete cache but stops active or pending queries for ["posts", filters] to prevent race conditions (e.g., a background refetch overwriting the optimistic update).

      const previousData = queryClient.getQueryData<PostsData>([
        "posts",
        filters,
      ]);

      if (previousData) {
        const tempPost = {
          id: `temp-${Date.now()}`,
          ...newPost,
          createdAt: new Date().toISOString(),
        };
        const newPosts = [tempPost, ...previousData.posts];
        const newTotalItems = previousData.totalItems + 1;
        const newTotalPages = Math.ceil(
          newTotalItems / (filters?.pageSize || 10)
        );

        queryClient.setQueryData<PostsData>(["posts", filters], {
          ...previousData,
          posts: newPosts,
          totalItems: newTotalItems,
          totalPages: newTotalPages,
        });

        return { previousData };
      }

      return {};
    },
    onError: (err, _newPost, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["posts", filters], context.previousData);
      }
      console.error("PostForm create onError:", {
        err,
        previousData: context?.previousData,
      });
      toast.error(`Error occurred: ${err.message}`, {
        position: "bottom-right",
        className: "bg-red-500 text-white",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"], exact: false });
      reset();
      toast.success("Post has been created.", {
        position: "bottom-right",
        className: "bg-green-500 text-white",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<Post, "id" | "createdAt">>;
    }) => updatePost(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["posts", filters] });

      const previousData = queryClient.getQueryData<PostsData>([
        "posts",
        filters,
      ]);

      if (previousData) {
        const newPosts = previousData.posts.map((post: Post) =>
          post.id === id ? { ...post, ...data } : post
        );
        queryClient.setQueryData<PostsData>(["posts", filters], {
          ...previousData,
          posts: newPosts,
        });
        return { previousData };
      }

      return {};
    },
    onError: (err, _newPost, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["posts", filters], context.previousData);
      }
      console.error("PostForm update onError:", {
        err,
        previousData: context?.previousData,
      });
      toast.error(`Error occurred: ${err.message}`, {
        position: "bottom-right",
        className: "bg-red-500 text-white",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"], exact: false });
      reset();
      toast.success("Post has been updated.", {
        position: "bottom-right",
        className: "bg-green-500 text-white",
      });
    },
  });

  const onSubmit = handleSubmit((data) => {
    if (data.id) {
      updateMutation.mutate({
        id: data.id,
        data: {
          title: data.title,
          content: data.content,
          author: data.author,
          category: data.category,
          status: data.status,
        },
      });
    } else {
      createMutation.mutate({
        title: data.title,
        content: data.content,
        author: data.author,
        category: data.category,
        status: data.status,
      });
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4 mb-4">
      <div>
        <input
          {...register("title")}
          placeholder="Title"
          className="border p-2 w-full rounded"
        />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}
      </div>
      <div>
        <textarea
          {...register("content")}
          placeholder="Content"
          className="border p-2 w-full rounded"
        />
        {errors.content && (
          <p className="text-red-500">{errors.content.message}</p>
        )}
      </div>
      <div>
        <input
          {...register("author")}
          placeholder="Author"
          className="border p-2 w-full rounded"
        />
        {errors.author && (
          <p className="text-red-500">{errors.author.message}</p>
        )}
      </div>
      <div>
        <select {...register("category")} className="border p-2 w-full rounded">
          <option value="tech">Tech</option>
          <option value="lifestyle">Lifestyle</option>
          <option value="education">Education</option>
        </select>
        {errors.category && (
          <p className="text-red-500">{errors.category.message}</p>
        )}
      </div>
      <div>
        <select {...register("status")} className="border p-2 w-full rounded">
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        {errors.status && (
          <p className="text-red-500">{errors.status.message}</p>
        )}
      </div>
      <Button type="submit" className="bg-blue-500 text-white px-4 py-2">
        {initialData ? "Update" : "Submit"}
      </Button>
    </form>
  );
}
