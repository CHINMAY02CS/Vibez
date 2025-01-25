const express = require("express");
const router = express.Router();
const requireLogin = require("../middlewares/requireLogin");
const {
  getAllPosts,
  getSelfPosts,
  createPost,
  getFollowingPosts,
  likePost,
  unlikePost,
  commentPost,
  deletePost,
} = require("../controller/postController");

//API for getting all posts of all users
router.get("/get-all-posts", requireLogin, getAllPosts);

//API for getting self posts for profile
router.get("/get-my-posts", requireLogin, getSelfPosts);

//API for creating a post
router.post("/create-post", requireLogin, createPost);

//API for deleting a post
router.delete("/delete-post/:postId", requireLogin, deletePost);

//API for liking a post
router.put("/like", requireLogin, likePost);

//API for unliking a post
router.put("/unlike", requireLogin, unlikePost);

//API for commenting on a post
router.put("/comment", requireLogin, commentPost);

//API for getting all posts of followed users
router.get("/my-following-post", requireLogin, getFollowingPosts);

module.exports = router;
