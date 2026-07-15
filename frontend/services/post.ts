import { Post } from "@/types/type";

export const getPosts = async (): Promise<{
  success: boolean;
  data: Post[];
}> => {
  try {
    const response = await fetch(`${process.env.BACKEND_API_URL}/api/post`);

    if (!response.ok) {
      throw new Error(
        `Error: ${response.statusText} with status ${response.status}`,
      );
    }

    const result = await response.json();
    return result;
  } catch (err) {
    console.error(err);
    return { success: false, data: [] };
  }
};
