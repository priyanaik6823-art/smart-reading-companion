const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    quote: {
      type: String,
      required: true,
    },

    author: {
      type: String,
      default: "",
    },

    bookName: {
      type: String,
      default: "",
    },

    selfMade: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quote", quoteSchema);