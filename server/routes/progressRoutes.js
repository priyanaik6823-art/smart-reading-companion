
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Progress = require("../models/Progress");
const Library = require("../models/Library");
console.log("🔥 progressRoutes FILE LOADED");

router.use((req, res, next) => {
  console.log("PROGRESS ROUTE HIT:", req.method, req.url);
  next();
});


// ================= SAVE / UPDATE PROGRESS =================
router.post("/save", async (req, res) => {
  try {
    const { userId, bookId, currentPage, totalPages } = req.body;

    const cleanUserId = new mongoose.Types.ObjectId(userId);
    const cleanBookId = new mongoose.Types.ObjectId(bookId);

    let progress = await Progress.findOne({
      userId: cleanUserId,
      bookId: cleanBookId,
    });

    if (progress) {
      progress.currentPage = currentPage;
      progress.totalPages = totalPages;
      progress.lastOpened = new Date();
      await progress.save();
      // ================= UPDATE LIBRARY STATUS =================

let status = "yet_to_read";

if (currentPage > 0 && currentPage < totalPages) {
  status = "reading";
}

if (currentPage >= totalPages) {
  status = "completed";
}

await Library.findOneAndUpdate(
  {
    userId: cleanUserId,
    bookId: cleanBookId,
  },
  {
    status,
  }
);
    } else {
      progress = new Progress({
        userId: cleanUserId,
        bookId: cleanBookId,
        currentPage,
        totalPages,
      });

      await progress.save();
      // ================= UPDATE LIBRARY STATUS =================

let status = "yet_to_read";

if (currentPage > 0 && currentPage < totalPages) {
  status = "reading";
}

if (currentPage >= totalPages) {
  status = "completed";
}

await Library.findOneAndUpdate(
  {
    userId: cleanUserId,
    bookId: cleanBookId,
  },
  {
    status,
  }
);

    }

    res.status(200).json(progress);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

// ================= CONTINUE READING (MUST BE FIRST) =================
router.get("/continue/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const latestProgress = await Progress.find({
      userId: new mongoose.Types.ObjectId(userId),
    })
      .sort({ lastOpened: -1 })
      .limit(1)
      .populate("bookId");

    res.status(200).json(latestProgress[0] || null);

  } catch (err) {
    console.log("CONTINUE ERROR:", err);

    res.status(500).json({
      error: err.message,
    });
  }
});



// ================= GET ALL PROGRESS =================
router.get("/user/:userId", async (req, res) => {
  try {

    console.log("USER ROUTE HIT");

    const { userId } = req.params;

    console.log("USER ID:", userId);

    // ✅ CHECK VALID OBJECT ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        error: "Invalid userId",
      });
    }

    const progress = await Progress.find({
      userId: new mongoose.Types.ObjectId(userId),
    })
      .populate("bookId")
      .sort({ updatedAt: -1 });

    console.log("PROGRESS FOUND:", progress);

    res.status(200).json(progress);

  } catch (err) {

    console.log("FULL ERROR:", err);

    res.status(500).json({
      error: err.message,
    });
  }
});

// ================= SINGLE BOOK PROGRESS =================
router.get("/user/:userId/book/:bookId", async (req, res) => {
  try {
    const { userId, bookId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(bookId)
    ) {
      return res.status(400).json({ message: "Invalid IDs" });
    }

    const progress = await Progress.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      bookId: new mongoose.Types.ObjectId(bookId),
    });

    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;