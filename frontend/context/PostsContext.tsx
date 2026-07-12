"use client";

import { getPosts } from "@/services/post";
import { Post } from "@/types/type";
import { createContext, ReactNode, useContext, useState } from "react";

type PostsContextType = {
  posts: Post[];
  loading: boolean;
  error: string | null;
  refreshPosts: () => Promise<void>;
  addPost: (post: Post) => void;
};

const PostsContext = createContext<PostsContextType | null>(null);

export function PostsProvider({
  children,
  initialPosts,
}: {
  children: ReactNode;
  initialPosts: Post[];
}) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshPosts = async () => {
    try {
      setLoading(true);
      const data = await getPosts();
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PostsContext.Provider
      value={{
        posts,
        loading,
        error,
        refreshPosts,
        addPost: (post) => setPosts((prev) => [post, ...prev]),
      }}
    >
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts() {
  const context = useContext(PostsContext);

  if (!context) throw new Error("usePosts must be used within a PostsProvider");

  return context;
}
