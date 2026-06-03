const express = require("express");
const router = express.Router();

const Library = require("../models/Library");


// ================= ADD TO LIBRARY =================
router.post("/add", async (req, res) => {
  try {

    const { userId, bookId } = req.body;

    // prevent duplicates
    const existing = await Library.findOne({
      userId,
      bookId,
    });

    if (existing) {
      return res.json({
        success: false,
        message: "Book already in library",
      });
    }

    const newLibraryBook = new Library({
      userId,
      bookId,
    });

    await newLibraryBook.save();

    res.json({
      success: true,
      message: "Added to library",
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
    });
  }
});


// ================= GET USER LIBRARY =================
router.get("/:userId", async (req, res) => {
  try {

    const libraryBooks = await Library.find({
      userId: req.params.userId,
    }).populate("bookId");

    res.json({
      success: true,
      libraryBooks,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
    });
  }
});

module.exports = router;