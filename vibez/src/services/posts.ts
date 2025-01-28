import axios from "axios";

export const getAllPostsService = async () => {
  try {
    const response = await axios.get("http://localhost:5000/get-all-posts", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (err) {
    console.error("Error fetching posts:", err);
    throw err;
  }
};

export const likePostService = async (id: string) => {
  const token = localStorage.getItem("jwt");
  if (!token) {
    return { error: "Authorization token not found!" };
  }

  try {
    const response = await axios.put(
      "http://localhost:5000/like",
      { postId: id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (err) {
    console.error("Error liking post:", err);
    return { error: "Failed to like the post." };
  }
};

export const unlikePostService = async (id: string) => {
  const token = localStorage.getItem("jwt");
  if (!token) {
    return { error: "Authorization token not found!" };
  }

  try {
    const response = await axios.put(
      "http://localhost:5000/unlike",
      { postId: id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (err) {
    console.error("Error unliking post:", err);
    return { error: "Failed to unlike the post." };
  }
};

export const addCommentService = async (text: string, id: string) => {
  const token = localStorage.getItem("jwt");
  if (!token) {
    return { error: "Authorization token not found!" };
  }

  try {
    const response = await axios.put(
      "http://localhost:5000/comment",
      {
        text: text,
        postId: id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (err) {
    console.error("Error commenting on post:", err);
    return { error: "Failed to comment on the post." };
  }
};
