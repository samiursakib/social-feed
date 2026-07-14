export const getPosts = async () => {
  try {
    const API_URL =
      typeof window === "undefined" ? process.env.BACKEND_API_URL : "";
    const response = await fetch(`${API_URL}/api/post`);

    if (!response.ok) {
      throw new Error(
        `Error: ${response.statusText} with status ${response.status}`,
      );
    }

    const result = await response.json();
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const uploadPost = async (formData: FormData) => {
  try {
    const API_URL =
      typeof window === "undefined" ? process.env.BACKEND_API_URL : "";
    const response = await fetch(`${API_URL}/api/post`, {
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
    throw err;
  }
};
