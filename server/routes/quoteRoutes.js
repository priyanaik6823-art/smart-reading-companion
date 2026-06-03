const express = require("express");

const router = express.Router();

const Quote = require("../models/Quote");
const User = require("../models/User");

const { protect } = require("../middleware/authMiddleware");


// ======================================
// CREATE QUOTE
// ======================================

router.post("/create", protect, async (req, res) => {
  try {
    const {
      quote,
      author,
      bookName,
      selfMade,
    } = req.body;

    const newQuote = new Quote({
      userId: req.user._id,

      quote,
      author,
      bookName,
      selfMade,
    });

    await newQuote.save();

    // increase post count
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $inc: { postsCount: 1 },
      }
    );

    res.json({
      success: true,
      quote: newQuote,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Error creating quote",
    });
  }
});


// ======================================
// GET USER QUOTES
// ======================================

router.get("/user/:userId", async (req, res) => {
  try {
    const quotes = await Quote.find({
      userId: req.params.userId,
    }).sort({ createdAt: -1 });

    res.json(quotes);

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Error fetching quotes",
    });
  }
});


// ======================================
// EDIT QUOTE
// ======================================

router.put("/:id", protect, async (req, res) => {
  try {
    const updatedQuote =
      await Quote.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    res.json(updatedQuote);

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Error updating quote",
    });
  }
});


// ======================================
// DELETE QUOTE
// ======================================

router.delete("/:id", protect, async (req, res) => {
  try {

    const quote = await Quote.findById(
      req.params.id
    );

    if (!quote) {
      return res.status(404).json({
        message: "Quote not found",
      });
    }

    await Quote.findByIdAndDelete(
      req.params.id
    );

    // decrease post count
    await User.findByIdAndUpdate(
      quote.userId,
      {
        $inc: { postsCount: -1 },
      }
    );

    res.json({
      success: true,
      message: "Quote deleted",
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Error deleting quote",
    });
  }
});

module.exports = router;