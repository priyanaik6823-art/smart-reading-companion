const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Book = require("../models/Book");
const Quote = require("../models/Quote"); // if not ready, you can comment it

const { protect } = require("../middleware/authMiddleware");
console.log("protect =", protect);
// Get profile
router.get("/:userId", protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select("-password")
      .populate("followers", "username profilePic")
      .populate("following", "username profilePic");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const books = await Book.find({ userId: req.params.userId });
const quotes = await Quote.find({ userId: req.params.userId });
    const booksCount = books.length;
    const quotesCount = quotes.length;

    

    res.status(200).json({
      success: true,
      user,
      books,
      quotes,
      stats: {
        booksCount,
        quotesCount,
        followers: user.followers.length,
        following: user.following.length,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
});

// Update profile
router.put("/:userId", protect, async (req, res) => {
  try {
    const { username, bio, profilePic } = req.body;

    // prevent others from editing your profile
    if (req.user._id.toString() !== req.params.userId) {
      return res.status(403).json({
        success: false,
        message: "Not allowed",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { username, bio, profilePic },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Profile update failed",
    });
  }
});

//current user profile

router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
});
module.exports = router;