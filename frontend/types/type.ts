export type User = {
  id: string;
  firstName: string;
  lastName: string;
};

export type Like = {
  id: string;
  userId: string;
};

export type Comment = {
  id: string;
  content: string;
  userId: string;
  createdAt: string; // JSON dates are received as strings
};

export type Visibility = "PUBLIC" | "PRIVATE";

export type Post = {
  id: string;
  content: string;
  imageUrl: string | null;
  visibility: Visibility;
  likeCount: number;
  commentCount: number;
  createdAt: string;

  user: User;
  likes: Like[];
  comments: Comment[];
};

export type UploadedPostResponse = {
  success: true;
  message: string;
  data: Post;
};
