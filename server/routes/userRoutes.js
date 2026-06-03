
const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User");
const upload = require("../middleware/uploadMiddleware");
const Book = require("../models/Book");

// ✅ GET LOGGED-IN USER (MY PROFILE)
router.get("/me", protect, async (req, res) => {
  try {
    const books = await Book.find({
  uploadedBy: req.user._id,
});

res.json({
  ...req.user._doc,
  books,
});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// ================= SEARCH USERS =================
router.get("/search", async (req, res) => {
  try {
    const query = req.query.query;

    if (!query || !query.trim()) {
      return res.json([]);
    }

    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    }).select("name email profilePic");

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET ANY USER PROFILE (IMPORTANT FOR YOUR COMMENTS CLICK)
router.get("/:id", async (req, res) => {
  try {
    // const user = await User.findById(req.params.id).select("-password");
const user = await User.findById(req.params.id)
  .select("-password")
  .populate("followers", "name email")
  .populate("following", "name email");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const books = await Book.find({
  uploadedBy: user._id,
});

res.json({
  ...user._doc,
  books,
});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//put routes

router.put("/edit", protect, async (req, res) => {
  try {
    const { name, bio } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.name = name || user.name;
    user.bio = bio || user.bio;

    await user.save();

    res.json(user);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

//profile pic routes
router.put(
  "/upload-profile-pic",
  protect,
  upload.single("profilePic"),
  async (req, res) => {
    try {
      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      user.profilePic = req.file.path;

      await user.save();

      res.json({
        message: "Profile picture uploaded",
        profilePic: req.file.path,
      });

    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  }
);
module.exports = router;