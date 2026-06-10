
//new 
// const mongoose = require("mongoose");
// const express = require("express");
// const router = express.Router();

// const Book = require("../models/Book");
// const Progress = require("../models/Progress");
// const Library = require("../models/Library");
// const Review = require("../models/Review");
// const upload = require("../middleware/upload");

// // ================= UPLOAD BOOK =================
// router.post(
//   "/",
//   upload.fields([
//     { name: "pdfFile", maxCount: 1 },
//     { name: "coverImage", maxCount: 1 }
//   ]),
//   async (req, res) => {
//     try {
//       const pdfFileName = req.files?.pdfFile?.[0]?.filename;
//       const coverImageName = req.files?.coverImage?.[0]?.filename || "";

//       const userId = req.body.userId;

//       if (!pdfFileName) {
//         return res.status(400).json({ error: "PDF file is required" });
//       }

//       const newBook = new Book({
//         title: req.body.title,
//         author: req.body.author,
//         totalPages: req.body.totalPages,
//         description: req.body.description,
//         genre: req.body.genre,
//         booklanguage: req.body.language,

//         uploadedBy: userId,   // ✅ FIXED (OWNER STORED HERE)

//         rating: (Math.random() * 2 + 3).toFixed(1),
//         reviews: Math.floor(Math.random() * 500) + 10,

//         pdfFile: `/uploads/pdfs/${pdfFileName}`,
//         coverImage: `/uploads/covers/${coverImageName}`
//       });

//       await newBook.save();

//       res.status(201).json({
//         message: "Book uploaded successfully",
//         newBook
//       });

//     } catch (err) {
//       console.log(err);
//       res.status(500).json({ error: err.message });
//     }
//   }
// );

// // ================= GET ALL BOOKS (PUBLIC) =================
// router.get("/", async (req, res) => {
//   try {
//     const books = await Book.find().sort({ createdAt: -1 });

//     res.status(200).json({ books });

//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch books" });
//   }
// });

// // ================= GET SINGLE BOOK =================
// router.get("/:id", async (req, res) => {
//   try {

//     const book = await Book.findById(req.params.id).populate("uploadedBy", "name profilePic");

//     res.json({
//       success: true,
//       book,
//     });

//   } catch (err) {
//     console.log(err);

//     res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// });


// // GET BOOKS OF PARTICULAR USER
// router.get("/user/:id", async (req, res) => {
//   try {
//     const books = await Book.find({
//       uploadedBy: req.params.id,
//     });

//     res.json(books);
//   } catch (err) {
//     res.status(500).json({
//       message: err.message,
//     });
//   }
// });

// // ================= DELETE BOOK (OWNER ONLY) =================
// router.delete("/:id", async (req, res) => {
//   try {
//     const { userId } = req.body;

//     const book = await Book.findById(req.params.id);

//     if (!book) {
//       return res.status(404).json({ message: "Book not found" });
//     }

//     // 🔒 OWNERSHIP CHECK (IMPORTANT)
//     if (book.uploadedBy?.toString() !== userId) {
//       return res.status(403).json({
//         message: "Not allowed to delete this book"
//       });
//     }

//     // ================= DELETE BOOK =================
// await Book.findByIdAndDelete(req.params.id);

// // ================= DELETE RELATED DATA =================
// await Progress.deleteMany({
//   bookId: new mongoose.Types.ObjectId(req.params.id),
// });

// await Library.deleteMany({
//   bookId: new mongoose.Types.ObjectId(req.params.id),
// });

// await Review.deleteMany({
//   bookId: new mongoose.Types.ObjectId(req.params.id),
// });

//     res.json({ message: "Deleted successfully" });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });


// module.exports = router;

const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

const Book = require("../models/Book");
const Progress = require("../models/Progress");
const Library = require("../models/Library");
const Review = require("../models/Review");
const upload = require("../middleware/upload");

// ================= CLOUDINARY =================
const cloudinary = require("../config/cloudinary");

// upload helper
const uploadToCloudinary = (buffer, folder, resourceType = "auto") => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
      },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    ).end(buffer);
  });
};

// ================= UPLOAD BOOK =================
router.post(
  "/",
  upload.fields([
    { name: "pdfFile", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const pdfFile = req.files?.pdfFile?.[0];
      const coverImage = req.files?.coverImage?.[0];

      const userId = req.body.userId;

      if (!pdfFile) {
        return res.status(400).json({ error: "PDF file is required" });
      }

      // ================= UPLOAD TO CLOUDINARY =================
      const pdfUpload = await uploadToCloudinary(
        pdfFile.buffer,
        "smart-reading/pdfs",
        "raw"
      );

      let coverUpload = null;

      if (coverImage) {
        coverUpload = await uploadToCloudinary(
          coverImage.buffer,
          "smart-reading/covers",
          "image"
        );
      }

      // ================= SAVE BOOK =================
      const newBook = new Book({
        title: req.body.title,
        author: req.body.author,
        totalPages: req.body.totalPages,
        description: req.body.description,
        genre: req.body.genre,
        booklanguage: req.body.language,

        uploadedBy: userId,

        rating: (Math.random() * 2 + 3).toFixed(1),
        reviews: Math.floor(Math.random() * 500) + 10,

        pdfFile: pdfUpload.secure_url,
        coverImage: coverUpload?.secure_url || ""
      });

      await newBook.save();

      res.status(201).json({
        message: "Book uploaded successfully",
        newBook
      });

    } catch (err) {
      console.log(err);
      res.status(500).json({ error: err.message });
    }
  }
);

// ================= GET ALL BOOKS (PUBLIC) =================
router.get("/", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.status(200).json({ books });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

// ================= GET SINGLE BOOK =================
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate(
      "uploadedBy",
      "name profilePic"
    );

    res.json({
      success: true,
      book,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// ================= GET USER BOOKS =================
router.get("/user/:id", async (req, res) => {
  try {
    const books = await Book.find({
      uploadedBy: req.params.id,
    });

    res.json(books);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// ================= DELETE BOOK (OWNER ONLY) =================
router.delete("/:id", async (req, res) => {
  try {
    const { userId } = req.body;

    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.uploadedBy?.toString() !== userId) {
      return res.status(403).json({
        message: "Not allowed to delete this book"
      });
    }

    await Book.findByIdAndDelete(req.params.id);

    await Progress.deleteMany({
      bookId: new mongoose.Types.ObjectId(req.params.id),
    });

    await Library.deleteMany({
      bookId: new mongoose.Types.ObjectId(req.params.id),
    });

    await Review.deleteMany({
      bookId: new mongoose.Types.ObjectId(req.params.id),
    });

    res.json({ message: "Deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
