

console.log("correct index.js is running");



const express = require("express");

const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const Book = require("./models/Book");

const bookRoutes = require("./routes/bookRoutes");
const authRoutes = require("./routes/authRoutes");
const progressRoutes = require("./routes/progressRoutes");
const libraryRoutes = require("./routes/libraryroutes");
const reviewRoutes = require("./routes/reviewRoutes");
const assistantRoutes = require("./routes/assistantRoutes");
const profileRoutes = require("./routes/profileRoutes");
const userRoutes = require("./routes/userRoutes");
const followRoutes = require("./routes/followRoutes");
const quoteRoutes = require("./routes/quoteRoutes");



require("dotenv").config();
const app = express();


// ✅ MIDDLEWARES
app.use(cors());
app.use(express.json());


// ✅ SERVE UPLOADS PUBLICLY
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// ✅ ROUTES
app.use("/api/books", bookRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/library", libraryRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/assistant", assistantRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/user", userRoutes);
app.use("/api/follow", followRoutes);
app.use("/api/quotes", quoteRoutes);


// ✅ MONGODB CONNECTION
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));


// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.send("API is working");
});


// ✅ TEST POST ROUTE
app.post("/test", (req, res) => {
  res.send("Test route working");
});

app.get("/test", (req, res) => {
  console.log("TEST ROUTE HIT");
  res.send("OK");
});

// ✅ START SERVER
app.listen(5000, () => console.log("Server running on port 5000"));
