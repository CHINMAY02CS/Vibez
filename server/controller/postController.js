const {
  getAllPostsService,
  getSelfPostsService,
  createPostService,
  getFollowingPostsService,
  likePostService,
  unlikePostService,
  commentPostService,
  deletePostService,
} = require("../services/postService");

const getAllPosts = async (req, res) => {
  try {
    const posts = await getAllPostsService();
    if (posts.error) {
      return res.status(404).json({ error: posts.error });
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
      return res.status(404).json({ error: posts.error });
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

const getFollowingPosts = async (req, res) => {
  try {
    const posts = await getFollowingPostsService({ userId: req.user._id });

    if (posts.error) {
      return res.status(404).json({ error: posts.error });
    }

    return res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching following posts:", err.message);
    return res.status(500).json({ error: "Failed to fetch posts" });
  }
};

const likePost = async (req, res) => {
  try {
    const updatedPost = await likePostService({
      postId: req.body.postId,
      userId: req.user._id,
    });
    if (updatedPost.error) {
      return res.status(422).json({ error: updatedPost.error });
    }
    return res.status(200).json(updatedPost);
  } catch (err) {
    return res.status(422).json({ error: err });
  }
};

const unlikePost = async (req, res) => {
  try {
    const updatedPost = await unlikePostService({
      postId: req.body.postId,
      userId: req.user._id,
    });
    if (updatedPost.error) {
      return res.status(422).json({ error: updatedPost.error });
    }
    return res.status(200).json(updatedPost);
  } catch (err) {
    return res.status(422).json({ error: err });
  }
};

const commentPost = async (req, res) => {
  try {
    const updatedPost = await commentPostService({
      text: req.body.text,
      userId: req.user._id,
      postId: req.body.postId,
    });
    if (updatedPost.error) {
      return res.status(404).json({ error: updatedPost.error });
    }
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(422).json({ error: err });
  }
};

const deletePost = async (req, res) => {
  try {
    const updatedPost = await deletePostService({
      postId: req.params.postId,
      userId: req.user._id,
    });
    if (updatedPost.error) {
      return res.status(404).json({ error: updatedPost.error });
    }
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(422).json({ error: err });
  }
};

module.exports = {
  getAllPosts,
  getSelfPosts,
  createPost,
  getFollowingPosts,
  likePost,
  unlikePost,
  commentPost,
  deletePost,
};
