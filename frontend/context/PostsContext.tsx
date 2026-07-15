"use client";

import { Comment, Post, Reply, UploadedPostResponse } from "@/types/type";
import { createContext, ReactNode, useContext, useState } from "react";
import { useAuth } from "./AuthContext";

type PostsContextType = {
  posts: Post[];
  loading: boolean;
  error: string | null;
  refreshPosts: () => Promise<void>;
  addPost: (post: Post) => void;
  uploadPost: (formData: FormData) => Promise<UploadedPostResponse>;
  likePost: (postId: string) => Promise<void>;
  unlikePost: (postId: string) => Promise<void>;
  createComment: (postId: string, content: string) => Promise<void>;
  likeComment: (postId: string, commentId: string) => Promise<void>;
  unlikeComment: (postId: string, commentId: string) => Promise<void>;
  createReply: (
    postId: string,
    commentId: string,
    content: string,
  ) => Promise<void>;
  likeReply: (
    postId: string,
    commentId: string,
    replyId: string,
  ) => Promise<void>;
  unlikeReply: (
    postId: string,
    commentId: string,
    replyId: string,
  ) => Promise<void>;
};

const PostsContext = createContext<PostsContextType | null>(null);

export function PostsProvider({
  children,
  initialPosts,
}: {
  children: ReactNode;
  initialPosts: Post[];
}) {
  const { authFetch, user } = useAuth();
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshPosts = async () => {
    try {
      setLoading(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const addPost = (post: Post) => setPosts((prev) => [post, ...prev]);

  const uploadPost = async (
    formData: FormData,
  ): Promise<UploadedPostResponse> => {
    try {
      const response = await authFetch("/api/post", {
        method: "Post",
        body: formData,
      });
      if (!response.ok) {
        throw new Error(
          `Error: ${response.statusText} with status code ${response.status}`,
        );
      }

      const result = await response.json();
      return result;
    } catch (err) {
      console.error(err);
      return {
        success: false,
        message: err instanceof Error ? err.message : "Something went wrong",
      };
    }
  };

  const likePost = async (postId: string) => {
    const userId = user?.id;
    if (!userId) return;

    let previousLikes: Post["likes"] = [];
    let previousLikeCount = 0;

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        previousLikes = [...post.likes];
        previousLikeCount = post.likeCount;
        return {
          ...post,
          likes: [
            ...post.likes,
            {
              id: "",
              userId,
            },
          ],
          likeCount: post.likeCount + 1,
        };
      }),
    );

    try {
      const response = await authFetch(`/api/post/${postId}/like`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Failed to like post.");
      }
    } catch (err) {
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                likes: previousLikes,
                likeCount: previousLikeCount,
              }
            : post,
        ),
      );
      throw err;
    }
  };

  const unlikePost = async (postId: string) => {
    const userId = user?.id;
    if (!userId) return;

    let previousLikes: Post["likes"] = [];
    let previousLikeCount = 0;

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        previousLikes = [...post.likes];
        previousLikeCount = post.likeCount;
        return {
          ...post,
          likes: post.likes.filter((like) => like.userId !== userId),
          likeCount: Math.max(0, post.likeCount - 1),
        };
      }),
    );

    try {
      const response = await authFetch(`/api/post/${postId}/like`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to unlike post.");
      }
    } catch (err) {
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                likes: previousLikes,
                likeCount: previousLikeCount,
              }
            : post,
        ),
      );
      throw err;
    }
  };

  const createComment = async (postId: string, content: string) => {
    if (!user) return;

    const trimmed = content.trim();
    if (!trimmed) return;

    const tempId = crypto.randomUUID();
    const tempComment: Comment = {
      id: tempId,
      content: trimmed,
      createdAt: new Date().toISOString(),
      likeCount: 0,
      likes: [],
      replies: [],
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };

    let previousComments: Post["comments"] = [];
    let previousCommentCount = 0;

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;

        previousComments = [...post.comments];
        previousCommentCount = post.commentCount;

        return {
          ...post,
          comments: [tempComment, ...post.comments],
          commentCount: post.commentCount + 1,
        };
      }),
    );

    try {
      const response = await authFetch(`/api/post/${postId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: trimmed,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to create comment.");
      }
      const result = await response.json();

      setPosts((prev) =>
        prev.map((post) => {
          if (post.id !== postId) return post;
          return {
            ...post,
            comments: post.comments.map((comment) =>
              comment.id === tempId ? result.data : comment,
            ),
          };
        }),
      );
    } catch (err) {
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: previousComments,
                commentCount: previousCommentCount,
              }
            : post,
        ),
      );
      throw err;
    }
  };

  const likeComment = async (postId: string, commentId: string) => {
    const userId = user?.id;
    if (!userId) return;

    let previousLikes: Comment["likes"] = [];
    let previousLikeCount = 0;

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        return {
          ...post,
          comments: post.comments.map((comment) => {
            if (comment.id !== commentId) return comment;

            previousLikes = [...comment.likes];
            previousLikeCount = comment.likeCount;

            return {
              ...comment,
              likes: [
                ...comment.likes,
                {
                  id: "",
                  userId,
                },
              ],
              likeCount: comment.likeCount + 1,
            };
          }),
        };
      }),
    );

    try {
      const response = await authFetch(`/api/comment/${commentId}/like`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Failed to like comment.");
      }
    } catch (err) {
      setPosts((prev) =>
        prev.map((post) => {
          if (post.id !== postId) return post;
          return {
            ...post,
            comments: post.comments.map((comment) =>
              comment.id === commentId
                ? {
                    ...comment,
                    likes: previousLikes,
                    likeCount: previousLikeCount,
                  }
                : comment,
            ),
          };
        }),
      );
      throw err;
    }
  };

  const unlikeComment = async (postId: string, commentId: string) => {
    const userId = user?.id;
    if (!userId) return;

    let previousLikes: Comment["likes"] = [];
    let previousLikeCount = 0;

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        return {
          ...post,
          comments: post.comments.map((comment) => {
            if (comment.id !== commentId) return comment;

            previousLikes = [...comment.likes];
            previousLikeCount = comment.likeCount;

            return {
              ...comment,
              likes: comment.likes.filter((like) => like.userId !== userId),
              likeCount: Math.max(0, comment.likeCount - 1),
            };
          }),
        };
      }),
    );

    try {
      const response = await authFetch(`/api/comment/${commentId}/like`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to unlike comment.");
      }
    } catch (err) {
      setPosts((prev) =>
        prev.map((post) => {
          if (post.id !== postId) return post;

          return {
            ...post,
            comments: post.comments.map((comment) =>
              comment.id === commentId
                ? {
                    ...comment,
                    likes: previousLikes,
                    likeCount: previousLikeCount,
                  }
                : comment,
            ),
          };
        }),
      );
      throw err;
    }
  };

  const createReply = async (
    postId: string,
    commentId: string,
    content: string,
  ) => {
    if (!user) return;

    const trimmed = content.trim();
    if (!trimmed) return;

    const tempId = crypto.randomUUID();

    const tempReply: Reply = {
      id: tempId,
      content: trimmed,
      createdAt: new Date().toISOString(),
      likeCount: 0,
      likes: [],
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };

    let previousReplies: Reply[] = [];
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;

        return {
          ...post,
          comments: post.comments.map((comment) => {
            if (comment.id !== commentId) return comment;

            previousReplies = [...comment.replies];

            return {
              ...comment,
              replies: [...comment.replies, tempReply],
            };
          }),
        };
      }),
    );

    try {
      const response = await authFetch(`/api/comment/${commentId}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: trimmed,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create reply.");
      }
      const result = await response.json();

      setPosts((prev) =>
        prev.map((post) => {
          if (post.id !== postId) return post;
          return {
            ...post,
            comments: post.comments.map((comment) => {
              if (comment.id !== commentId) return comment;
              return {
                ...comment,
                replies: comment.replies.map((reply) =>
                  reply.id === tempId ? result.data : reply,
                ),
              };
            }),
          };
        }),
      );
    } catch (err) {
      setPosts((prev) =>
        prev.map((post) => {
          if (post.id !== postId) return post;
          return {
            ...post,
            comments: post.comments.map((comment) =>
              comment.id === commentId
                ? {
                    ...comment,
                    replies: previousReplies,
                  }
                : comment,
            ),
          };
        }),
      );
      throw err;
    }
  };

  const likeReply = async (
    postId: string,
    commentId: string,
    replyId: string,
  ) => {
    const userId = user?.id;
    if (!userId) return;

    let previousLikes: Reply["likes"] = [];
    let previousLikeCount = 0;

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        return {
          ...post,
          comments: post.comments.map((comment) => {
            if (comment.id !== commentId) return comment;
            return {
              ...comment,
              replies: comment.replies.map((reply) => {
                if (reply.id !== replyId) return reply;

                previousLikes = [...reply.likes];
                previousLikeCount = reply.likeCount;

                return {
                  ...reply,
                  likes: [
                    ...reply.likes,
                    {
                      id: "",
                      userId,
                    },
                  ],
                  likeCount: reply.likeCount + 1,
                };
              }),
            };
          }),
        };
      }),
    );

    try {
      const response = await authFetch(`/api/reply/${replyId}/like`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Failed to like reply.");
      }
    } catch (err) {
      setPosts((prev) =>
        prev.map((post) => {
          if (post.id !== postId) return post;
          return {
            ...post,
            comments: post.comments.map((comment) => {
              if (comment.id !== commentId) return comment;
              return {
                ...comment,
                replies: comment.replies.map((reply) =>
                  reply.id === replyId
                    ? {
                        ...reply,
                        likes: previousLikes,
                        likeCount: previousLikeCount,
                      }
                    : reply,
                ),
              };
            }),
          };
        }),
      );
      throw err;
    }
  };

  const unlikeReply = async (
    postId: string,
    commentId: string,
    replyId: string,
  ) => {
    const userId = user?.id;
    if (!userId) return;

    let previousLikes: Reply["likes"] = [];
    let previousLikeCount = 0;

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        return {
          ...post,
          comments: post.comments.map((comment) => {
            if (comment.id !== commentId) return comment;
            return {
              ...comment,
              replies: comment.replies.map((reply) => {
                if (reply.id !== replyId) return reply;

                previousLikes = [...reply.likes];
                previousLikeCount = reply.likeCount;

                return {
                  ...reply,
                  likes: reply.likes.filter((like) => like.userId !== userId),
                  likeCount: Math.max(0, reply.likeCount - 1),
                };
              }),
            };
          }),
        };
      }),
    );

    try {
      const response = await authFetch(`/api/reply/${replyId}/like`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to unlike reply.");
      }
    } catch (err) {
      setPosts((prev) =>
        prev.map((post) => {
          if (post.id !== postId) return post;
          return {
            ...post,
            comments: post.comments.map((comment) => {
              if (comment.id !== commentId) return comment;
              return {
                ...comment,
                replies: comment.replies.map((reply) =>
                  reply.id === replyId
                    ? {
                        ...reply,
                        likes: previousLikes,
                        likeCount: previousLikeCount,
                      }
                    : reply,
                ),
              };
            }),
          };
        }),
      );
      throw err;
    }
  };

  return (
    <PostsContext.Provider
      value={{
        posts,
        loading,
        error,
        refreshPosts,
        addPost,
        likePost,
        unlikePost,
        uploadPost,
        createComment,
        likeComment,
        unlikeComment,
        createReply,
        likeReply,
        unlikeReply,
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
