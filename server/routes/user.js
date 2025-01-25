const express = require("express");
const router = express.Router();
const requireLogin = require("../middlewares/requireLogin");

const {
  getUserProfile,
  followUserProfile,
  unfollowUserProfile,
  uploadUserProfilePic,
} = require("../controller/userController");

// Api for getting user profile
router.get("/user/:id", getUserProfile);

// Api for following user
router.put("/follow", requireLogin, followUserProfile);

// Api for unfollowing user
router.put("/unfollow", requireLogin, unfollowUserProfile);

// Api for uploading user profile picture
router.put("/upload-profile-pic", requireLogin, uploadUserProfilePic);

module.exports = router;
