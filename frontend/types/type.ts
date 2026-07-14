export type User = {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordHash?: string;
};

export type Like = {
  id: string;
  userId: string;
};

export type Comment = {
  id: string;
  content: string;
  userId: string;
  createdAt: string;
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
  success: boolean;
  message: string;
  data: Post;
};

export type RegisteredUserResponse = {
  success: boolean;
  message: string;
  data: User;
};

export type LoggedInUserResponse = {
  success: boolean;
  message: string;
  data: string;
};
