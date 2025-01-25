const {
  getUserProfileService,
  followUser,
  unfollowUser,
  uploadProfilePic,
} = require("../services/userService");

const getUserProfile = async (req, res) => {
  try {
    const data = await getUserProfileService({ userId: req.params.id });
    if (data.error) {
      return res.status(404).json({ error: data.error });
    }
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: data.error });
  }
};

const followUserProfile = async (req, res) => {
  try {
    const user = await followUser({
      followId: req.body.followId,
      userId: req.user._id,
    });
    if (user.error) {
      return res.status(404).json({ error: user.error });
    }
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ error: user.error });
  }
};

const unfollowUserProfile = async (req, res) => {
  try {
    const user = await unfollowUser({
      followId: req.body.followId,
      userId: req.user._id,
    });
    if (user.error) {
      return res.status(404).json({ error: user.error });
    }
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ error: user.error });
  }
};

const uploadUserProfilePic = async (req, res) => {
  try {
    const updatedUser = await uploadProfilePic({
      userId: req.user._id,
      pic: req.body.pic,
    });
    if (updatedUser.error) {
      return res.status(404).json({ error: updatedUser.error });
    }
    return res.status(200).json(updatedUser);
  } catch (err) {
    return res.status(500).json({ error: updatedUser.error });
  }
};

module.exports = {
  getUserProfile,
  followUserProfile,
  unfollowUserProfile,
  uploadUserProfilePic,
};
