const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    author: {
      type: String,
      default: "Unknown",
    },

    totalPages: {
      type: Number,
      default: 0,
    },

    description: {
      type: String,
      default: "",
    },

    coverImage: {
      type: String, // local file path
      default: "",
    },

    pdfFile: {
      type: String, // local uploaded PDF path
      required: true,
    },

    uploadedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true
},
 
genre: {
  type: String,
  default: "Unknown",
},

booklanguage: {
  type: String,
  default: "English",
},

rating: {
  type: Number,
  default: 0,
},

reviews: {
  type: Number,
  default: 0,
},
userId: { type: mongoose.Schema.Types.ObjectId, 
  ref: "User" },
  uploadedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
},
 },
  { timestamps: true }
);


bookSchema.index({
  title: "text",
  author: "text",
  genre: "text",
  booklanguage: "text",
});

module.exports = mongoose.model("Book", bookSchema);