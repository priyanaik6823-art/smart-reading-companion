const mongoose = require("mongoose");

const librarySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },

    status: {
      type: String,
      enum: ["yet_to_read", "reading", "completed"],
      default: "yet_to_read",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Library", librarySchema);