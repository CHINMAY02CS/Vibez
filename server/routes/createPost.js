const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const POST = mongoose.model("POST");

router.get("/get-all-posts", requireLogin, (req, res) => {
  POST.find()
    .populate("postedBy", "_id name")
    .then((posts) => res.json(posts))
    .catch((err) => console.log(err));
});

router.get("/get-my-posts", requireLogin, (req, res) => {
  POST.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name")
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
    photo: pic,
    postedBy: req.user,
  });
  post
    .save()
    .then((result) => res.json({ post: result }))
    .catch((error) => console.log(error));
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
    ).populate("postedBy", "_id name Photo");
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
    ).populate("postedBy", "_id name Photo");
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
      .populate("comments.postedBy", "_id name")
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

module.exports = router;
