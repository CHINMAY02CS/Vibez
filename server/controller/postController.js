const mongoose = require("mongoose");
const POST = mongoose.model("POST");
const {
  getAllPostsService,
  getSelfPostsService,
  createPostService,
} = require("../services/postService");

const getAllPosts = async (req, res) => {
  try {
    const posts = await getAllPostsService();
    if (posts.error) {
      return res.status(404).json({ error: "No posts found" });
    }
    return res.status(200).json(posts);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch posts" });
  }
};

const getSelfPosts = async (req, res) => {
  try {
    const posts = await getSelfPostsService({ id: req.user._id });
    if (posts.error) {
      return res.status(404).json({ error: "No posts found" });
    }
    return res.status(200).json(posts);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch posts" });
  }
};

const createPost = async (req, res) => {
  const { body, pic } = req.body;
  try {
    const post = await createPostService({ body, pic, user: req.user });
    if (post.error) {
      return res.status(404).json({ error: post.error });
    }
    return res.status(200).json({ message: "Post created successfully", post });
  } catch (err) {
    return res.status(500).json({ error: "Failed to create post" });
  }
};

module.exports = { getAllPosts, getSelfPosts, createPost };
