const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const POST = mongoose.model("POST");

router.get("/get-all-posts", requireLogin, (req, res) => {
  POST.find()
    .populate("postedBy", "_id name Photo")
    .populate("comments.postedBy", "_id name Photo")
    .then((posts) => res.json(posts))
    .catch((err) => console.log(err));
});

router.get("/get-my-posts", requireLogin, (req, res) => {
  POST.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name Photo")
    .populate("comments.postedBy", "_id name Photo")
    .then((posts) => res.json(posts))
    .catch((err) => console.log(err));
});

router.post("/create-post", requireLogin, (req, res) => {
  const { body, pic } = req.body;
  if (!body || !pic) {
    return res.status(422).json({ error: "Please add all the fields" });
  }
  req.user;
  const post = new POST({
    body,
    Photo: pic,
    postedBy: req.user,
  });
  post
    .save()
    .then((result) => res.json({ post: result }))
    .catch((error) => console.log(error));
});

router.delete("/delete-post/:postId", requireLogin, async (req, res) => {
  try {
    const post = await POST.findOne({ _id: req.params.postId }).populate(
      "postedBy",
      "_id"
    );
    if (!post) {
      return res.status(422).json({ error: "Post not found" });
    }
    if (post.postedBy._id.toString() === req.user._id.toString()) {
      await POST.deleteOne({ _id: req.params.postId });
      return res.json({ data: post, message: "Successfully deleted" });
    } else {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this post" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "An error occurred" });
  }
});

router.put("/like", requireLogin, async (req, res) => {
  try {
    const updatedPost = await POST.findByIdAndUpdate(
      req.body.postId,
      {
        $push: {
          likes: req.user._id,
        },
      },
      { new: true }
    )
      .populate("postedBy", "_id name Photo")
      .populate("comments.postedBy", "_id name Photo");

    res.json(updatedPost);
  } catch (err) {
    res.status(422).json({ error: err });
  }
});

router.put("/unlike", requireLogin, async (req, res) => {
  try {
    const updatedPost = await POST.findByIdAndUpdate(
      req.body.postId,
      {
        $pull: {
          likes: req.user._id,
        },
      },
      { new: true }
    )
      .populate("postedBy", "_id name Photo")
      .populate("comments.postedBy", "_id name Photo");

    res.json(updatedPost);
  } catch (err) {
    res.status(422).json({ error: err });
  }
});

router.put("/comment", requireLogin, async (req, res) => {
  try {
    const comment = {
      comment: req.body.text,
      postedBy: req.user._id,
    };
    const updatedPost = await POST.findByIdAndUpdate(
      req.body.postId,
      { $push: { comments: comment } },
      { new: true }
    )
      .populate("comments.postedBy", "_id name Photo")
      .populate("postedBy", "_id name Photo");
    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(updatedPost);
  } catch (err) {
    console.error(err);
    res.status(422).json({ error: "Unable to add comment" });
  }
});

router.get("/my-following-post", requireLogin, async (req, res) => {
  try {
    if (!req.user?.following || req.user.following.length === 0) {
      return res.status(400).json({ error: "No following users found" });
    }

    const posts = await POST.find({ postedBy: { $in: req.user.following } })
      .populate("postedBy", "_id name Photo")
      .populate("comments.postedBy", "_id name Photo");

    if (!posts.length) {
      return res
        .status(404)
        .json({ message: "No posts found from following users" });
    }

    return res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching following posts:", err.message);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching posts" });
  }
});

module.exports = router;
