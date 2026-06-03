const express = require("express");
const router = express.Router();

const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");
// follow user
router.post("/follow/:id", protect, async (req, res) => {
  try {
    const userToFollow = req.params.id;
    const currentUserId = req.user._id;

    if (userToFollow === currentUserId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot follow yourself",
      });
    }

    const user = await User.findById(userToFollow);
    const currentUser = await User.findById(currentUserId);

    if (!user || !currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // avoid duplicate follow
    if (!user.followers.some(id => id.toString() === currentUserId.toString())) {
      user.followers.push(currentUserId);
      currentUser.following.push(userToFollow);
    }

    await user.save();
    await currentUser.save();

    res.status(200).json({
      success: true,
      message: "Followed successfully",
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Follow failed",
    });
  }
});

//unfollow user
router.post("/unfollow/:id", protect, async (req, res) => {
  try {
    const userToUnfollow = req.params.id;
    const currentUserId = req.user._id;

    const user = await User.findById(userToUnfollow);
    const currentUser = await User.findById(currentUserId);

    if (!user || !currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.followers = user.followers.filter(
      (id) => id.toString() !== currentUserId.toString()
    );

    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== userToUnfollow
    );

    await user.save();
    await currentUser.save();

    res.status(200).json({
      success: true,
      message: "Unfollowed successfully",
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Unfollow failed",
    });
  }
});

module.exports = router;