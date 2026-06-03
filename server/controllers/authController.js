const User = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");


// ===============================
// EMAIL TRANSPORTER
// ===============================

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


// ===============================
// GENERATE OTP
// ===============================

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};


// ===============================
// REGISTER + SEND OTP
// ===============================

exports.register = async (req, res) => {
  try {

    const { name, email, password } = req.body;

    // CHECK EXISTING USER
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // GENERATE OTP
    const otp = generateOTP();

    // CREATE USER
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpiry: Date.now() + 5 * 60 * 1000,
      isVerified: false,
    });

    // SEND EMAIL
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Account - Smart Reading App",

      html: `
        <div style="font-family:sans-serif;padding:20px">
          <h2>Hello ${name} 👋</h2>

          <p>Your OTP for account verification is:</p>

          <h1 style="color:orange">${otp}</h1>

          <p>This OTP expires in 5 minutes.</p>
        </div>
      `,
    });

    res.status(201).json({
      message: "OTP sent to email",
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
};


// ===============================
// VERIFY OTP
// ===============================

exports.verifyOTP = async (req, res) => {
  try {

    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // CHECK OTP
    if (user.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // CHECK OTP EXPIRY
    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    // VERIFY USER
    user.isVerified = true;
    user.otp = "";
    user.otpExpiry = null;

    await user.save();

    res.status(200).json({
      message: "Account verified successfully",
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
};


// ===============================
// LOGIN
// ===============================

exports.login = async (req, res) => {
  try {

    const { email, password } = req.body;

    // FIND USER
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    // CHECK VERIFIED
    if (!user.isVerified) {
      return res.status(400).json({
        message: "Please verify your email first",
      });
    }

    // CHECK PASSWORD
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // JWT TOKEN
    const token = jwt.sign(
      {
        id: user._id,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      message: "Login successful",

      token,

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
};


// ===============================
// FORGOT PASSWORD
// ===============================

exports.forgotPassword = async (req, res) => {
  try {

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // GENERATE OTP
    const otp = generateOTP();

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();

    // SEND MAIL
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,

      subject: "Reset Password OTP",

      html: `
        <div style="font-family:sans-serif;padding:20px">
          <h2>Password Reset Request 🔐</h2>

          <p>Your OTP is:</p>

          <h1 style="color:orange">${otp}</h1>

          <p>This OTP expires in 5 minutes.</p>
        </div>
      `,
    });

    res.status(200).json({
      message: "OTP sent successfully",
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
};


// ===============================
// RESET PASSWORD
// ===============================

exports.resetPassword = async (req, res) => {
  try {

    const {
      email,
      otp,
      newPassword,
    } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // CHECK OTP
    if (user.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // CHECK OTP EXPIRY
    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    // HASH NEW PASSWORD
    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    user.password = hashedPassword;

    user.otp = "";
    user.otpExpiry = null;

    await user.save();

    res.status(200).json({
      message: "Password reset successful",
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
};