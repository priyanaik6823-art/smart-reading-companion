const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Review = require("../models/Review");
const Book = require("../models/Book");
const Progress = require("../models/Progress");


// ================= ADD REVIEW =================
router.post("/add", async (req, res) => {
  try {

    const { userId, bookId, rating, comment } = req.body;

    const cleanUserId = new mongoose.Types.ObjectId(userId);
    const cleanBookId = new mongoose.Types.ObjectId(bookId);

    // ================= CHECK PROGRESS =================
    const progress = await Progress.findOne({
      userId: cleanUserId,
      bookId: cleanBookId,
    });

    // must read at least 10 pages
    if (!progress || progress.currentPage < 10) {
      return res.status(403).json({
        success: false,
        message: "Read at least 10 pages to review",
      });
    }

    // ================= CHECK EXISTING REVIEW =================
    const existingReview = await Review.findOne({
      userId: cleanUserId,
      bookId: cleanBookId,
    });

    if (existingReview) {

      existingReview.rating = rating;
      existingReview.comment = comment;

      await existingReview.save();

    } else {

      const newReview = new Review({
        userId: cleanUserId,
        bookId: cleanBookId,
        rating,
        comment,
      });

      await newReview.save();
    }

    // ================= RECALCULATE AVERAGE =================
    const allReviews = await Review.find({
      bookId: cleanBookId,
    });

    const totalRatings = allReviews.reduce(
      (sum, item) => sum + item.rating,
      0
    );

    const averageRating =
      totalRatings / allReviews.length;

    await Book.findByIdAndUpdate(cleanBookId, {
      rating: averageRating.toFixed(1),
      reviews: allReviews.length,
    });

    res.json({
      success: true,
      message: "Review submitted successfully",
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});


// ================= GET BOOK REVIEWS =================
router.get("/:bookId", async (req, res) => {
  try {

    const reviews = await Review.find({
      bookId: req.params.bookId,
    })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      reviews,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
    });
  }
});

module.exports = router;