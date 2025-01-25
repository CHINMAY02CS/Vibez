const mongoose = require("mongoose");
const USER = mongoose.model("USER");
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
      return { error: "Please add all the fields" };
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

const commentPostService = async ({ text, userId, postId }) => {
  try {
    const comment = {
      comment: text,
      postedBy: userId,
    };

    const updatedPost = await POST.findByIdAndUpdate(
      postId,
      { $push: { comments: comment } },
      { new: true }
    )
      .populate("comments.postedBy", "_id name Photo")
      .populate("postedBy", "_id name Photo");

    if (!updatedPost) {
      return { error: "Post not found" };
    }

    return updatedPost;
  } catch (error) {
    console.error("Comment on post Service Error:", error);
    return { error: "Comment on post failed" };
  }
};

const getFollowingPostsService = async ({ userId }) => {
  try {
    const user = await USER.findById(userId);

    if (!user || !user.following || user.following.length === 0) {
      return { error: "No following users found" };
    }

    const posts = await POST.find({ postedBy: { $in: user.following } })
      .populate("postedBy", "_id name Photo")
      .populate("comments.postedBy", "_id name Photo");

    if (!posts || posts.length === 0) {
      return { error: "No posts found from following users" };
    }

    return posts;
  } catch (error) {
    console.error("Error fetching following posts in service:", error);
    return { error: "Error fetching following posts" };
  }
};

const likePostService = async ({ postId, userId }) => {
  try {
    const updatedPost = await POST.findByIdAndUpdate(
      postId,
      {
        $push: {
          likes: userId,
        },
      },
      { new: true }
    )
      .populate("postedBy", "_id name Photo")
      .populate("comments.postedBy", "_id name Photo");

    return updatedPost;
  } catch (error) {
    console.error("Error liking post service:", error);
    return { error: "Failed to like post" };
  }
};

const unlikePostService = async ({ postId, userId }) => {
  try {
    const updatedPost = await POST.findByIdAndUpdate(
      postId,
      {
        $pull: {
          likes: userId,
        },
      },
      { new: true }
    )
      .populate("postedBy", "_id name Photo")
      .populate("comments.postedBy", "_id name Photo");

    return updatedPost;
  } catch (error) {
    console.error("Error liking post service:", error);
    return { error: "Failed to like post" };
  }
};

const deletePostService = async ({ postId, userId }) => {
  try {
    const post = await POST.findOne({ _id: postId }).populate(
      "postedBy",
      "_id"
    );
    if (!post) {
      return { error: "Post not found" };
    }
    const owner = post.postedBy._id.toString() === userId.toString();
    if (owner) {
      await POST.deleteOne({ _id: postId });
      return { data: post, message: "Successfully deleted" };
    } else {
      return { error: "You are not authorized to delete this post" };
    }
  } catch (error) {
    console.error("Error in delete post service:", error);
    return { error: "Failed to delete post" };
  }
};

module.exports = {
  getAllPostsService,
  getSelfPostsService,
  createPostService,
  getFollowingPostsService,
  likePostService,
  unlikePostService,
  deletePostService,
  commentPostService,
};
