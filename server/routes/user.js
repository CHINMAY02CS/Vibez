const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const USER = mongoose.model("USER");
const POST = mongoose.model("POST");

router.get("/user/:id", async (req, res) => {
  try {
    const user = await USER.findOne({ _id: req.params.id }).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const posts = await POST.find({ postedBy: req.params.id })
      .populate("postedBy", "_id name")
      .populate("comments.postedBy", "_id name photo");

    res.status(200).json({ user, posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

router.put("/follow", requireLogin, async (req, res) => {
  try {
    const updatedFollowedUser = await USER.findByIdAndUpdate(
      req.body.followId,
      { $push: { followers: req.user._id } },
      { new: true }
    );

    if (!updatedFollowedUser) {
      return res.status(422).json({ error: "User to follow not found" });
    }

    const updatedFollowingUser = await USER.findByIdAndUpdate(
      req.user._id,
      { $push: { following: req.body.followId } },
      { new: true }
    );

    res.json(updatedFollowingUser);
  } catch (err) {
    res.status(422).json({ error: "Some error occured. Please try again" });
  }
});

router.put("/unfollow", requireLogin, async (req, res) => {
  try {
    const updatedUnfollowedUser = await USER.findByIdAndUpdate(
      req.body.followId,
      { $pull: { followers: req.user._id } },
      { new: true }
    );

    if (!updatedUnfollowedUser) {
      return res.status(422).json({ error: "User to unfollow not found" });
    }

    const updatedFollowingUser = await USER.findByIdAndUpdate(
      req.user._id,
      { $pull: { following: req.body.followId } },
      { new: true }
    );

    res.json(updatedFollowingUser);
  } catch (err) {
    res.status(422).json({ error: "Some error occured. Please try again" });
  }
});

module.exports = router;
