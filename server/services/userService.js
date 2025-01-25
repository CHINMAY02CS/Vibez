const mongoose = require("mongoose");
const USER = mongoose.model("USER");
const POST = mongoose.model("POST");

const getUserProfileService = async ({ userId }) => {
  try {
    const user = await USER.findOne({ _id: userId }).select("-password");

    if (!user) {
      return { error: "User not found" + userId };
    }
    const posts = await POST.find({ postedBy: userId })
      .populate("postedBy", "_id name Photo")
      .populate("comments.postedBy", "_id name Photo");

    return { user, posts };
  } catch (error) {
    console.error("Get user profile Service Error:", error);
    return { error: "Get user profile failed" };
  }
};

const followUser = async ({ followId, userId }) => {
  try {
    const updatedFollowedUser = await USER.findByIdAndUpdate(
      followId,
      { $push: { followers: userId } },
      { new: true }
    );

    if (!updatedFollowedUser) {
      return { error: "User to follow not found" };
    }

    const updatedFollowingUser = await USER.findByIdAndUpdate(
      userId,
      { $push: { following: followId } },
      { new: true }
    );

    if (!updatedFollowingUser) {
      return { error: "User following not found" };
    }
    return { updatedFollowingUser };
  } catch (error) {
    console.error("Follow user Service Error:", error);
    return { error: "Follow user failed" };
  }
};

const unfollowUser = async ({ followId, userId }) => {
  try {
    const updatedUnfollowedUser = await USER.findByIdAndUpdate(
      followId,
      { $pull: { followers: userId } },
      { new: true }
    );

    if (!updatedUnfollowedUser) {
      return { error: "User to unfollow not found" };
    }

    const updatedunFollowingUser = await USER.findByIdAndUpdate(
      userId,
      { $pull: { following: followId } },
      { new: true }
    );

    if (!updatedunFollowingUser) {
      return { error: "User unfollowing not found" };
    }
    return { updatedunFollowingUser };
  } catch (error) {
    console.error("UnFollow user Service Error:", error);
    return { error: "UnFollow user failed" };
  }
};

const uploadProfilePic = async ({ userId, pic }) => {
  try {
    const updatedUser = await USER.findByIdAndUpdate(
      userId,
      { $set: { Photo: pic } },
      { new: true }
    );

    if (!updatedUser) {
      return { error: "User not found or update failed" };
    }

    return { updatedUser };
  } catch (error) {
    console.error("Upload user profile picture Service Error:", error);
    return { error: "Upload user profile picture failed" };
  }
};

module.exports = {
  getUserProfileService,
  followUser,
  unfollowUser,
  uploadProfilePic,
};
