const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    otp: {
      type: String,
      default: "",
    },

    otpExpiry: {
      type: Date,
    },

    preferences: {
      type: [String],
      default: [],
    },

    bio: {
  type: String,
  default: "",
},

theme: {
  type: String,
  default: "light",
},

avatar: {
  type: String,
  default: "",
},

profilePic: {
    type: String,
    default: ""
  },

  followers: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  ],

  following: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  ],

  createdAt: {
    type: Date,
    default: Date.now
  },
  uploadedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
},
postsCount: {
  type: Number,
  default: 0,
},
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);