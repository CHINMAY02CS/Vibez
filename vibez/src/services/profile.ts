import axios from "axios";

export const commentPostService = async (id: string, text: string) => {
  try {
    if (!token) {
      return { error: "Authorization token not found!" };
    }
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
    return { error: "Failed to comment on post." };
  }
};

export const fetchUserPostsService = async () => {
  try {
    if (!token) {
      return { error: "Authorization token not found!" };
    }
    if (!user) {
      return { error: "User not found!" };
    }
    const response = await axios.get(`http://localhost:5000/user/${JSON.parse(user)?._id}`);
    return response.data;
  } catch (err) {
    console.error("Error fetching user posts:", err);
    return { error: "Failed to fetch user posts." };
  }
};

export const fetchSelfPostsService = async () => {
  try {
    if (!token) {
      return { error: "Authorization token not found!" };
    }
    if (!user) {
      return { error: "User not found!" };
    }
    const response = await axios.get(
      "http://localhost:5000/get-my-posts",

      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (err) {
    console.error("Error fetching self posts:", err);
    return { error: "Failed to fetch self posts." };
  }
};

export const deletePostService = async (postId: string) => {
  try {
    if (!token) {
      return { error: "Authorization token not found!" };
    }

    const response = await axios.delete(`http://localhost:5000/delete-post/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (err) {
    console.error("Error deleting posts", err);
    return { error: "Failed to delete post." };
  }
};

export const uploadProfilePicService = async (imageUrl: string | null) => {
  try {
    if (!token) {
      return { error: "Authorization token not found!" };
    }

    const response = await axios.put(
      "http://localhost:5000/upload-profile-pic",
      JSON.stringify({
        pic: imageUrl,
      }),
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (err) {
    console.error("Error deleting posts", err);
    return { error: "Failed to delete post." };
  }
};

export const removeProfilePicService = async () => {
  try {
    if (!token) {
      return { error: "Authorization token not found!" };
    }

    const response = await axios.put(
      "http://localhost:5000/upload-profile-pic",
      JSON.stringify({
        pic: null,
      }),
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (err) {
    console.error("Error deleting posts", err);
    return { error: "Failed to delete post." };
  }
};

const token = localStorage.getItem("jwt");
const user = localStorage.getItem("user");
