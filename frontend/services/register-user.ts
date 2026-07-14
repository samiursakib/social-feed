import { User } from "@/types/type";

export const registerUser = async (body: User) => {
  const API_URL =
    typeof window === "undefined" ? process.env.BACKEND_API_URL : "";

  try {
    const response = await fetch(`${API_URL}/api/user`, {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
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
    throw err;
  }
};
