const mongoose = require("mongoose");
const USER = mongoose.model("USER");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const POST = mongoose.model("POST");

const getAllPostsService = async () => {
  try {
    const posts = await POST.find()
      .populate("postedBy", "_id name Photo")
      .populate("comments.postedBy", "_id name Photo");
    if (!posts || posts.length === 0) {
      return { error: "No posts found" };
    }
    return posts;
  } catch (error) {
    console.error("Get All Posts Service Error:", error);
    return { error: "Get all posts failed" };
  }
};

const getSelfPostsService = async ({ id }) => {
  try {
    const posts = await POST.find({ postedBy: id })
      .populate("postedBy", "_id name Photo")
      .populate("comments.postedBy", "_id name Photo");

    if (!posts || posts.length === 0) {
      return { error: "No posts found" };
    }
    return posts;
  } catch (error) {
    console.error("Get All Posts Service Error:", error);
    return { error: "Get all posts failed" };
  }
};

const createPostService = async ({ body, pic, user }) => {
  try {
    if (!body || !pic) {
      return res.status(422).json({ error: "Please add all the fields" });
    }
    const post = new POST({
      body: body,
      photo: pic,
      postedBy: user,
    });
    if (post) {
      await post.save();
    }
    return post;
  } catch (error) {
    console.error("Create post Service Error:", error);
    return { error: "Create post failed" };
  }
};

module.exports = { getAllPostsService, getSelfPostsService, createPostService };
