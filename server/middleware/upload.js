// const multer = require("multer");
// const path = require("path");

// // Ensure safe absolute paths
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     try {
//       if (file.mimetype === "application/pdf") {
//         cb(null, path.join(__dirname, "../uploads/pdfs/"));
//       } else if (file.mimetype.startsWith("image/")) {
//         cb(null, path.join(__dirname, "../uploads/covers/"));
//       } else {
//         cb(new Error("Invalid file type"), null);
//       }
//     } catch (err) {
//       cb(err, null);
//     }
//   },

//  filename: (req, file, cb) => {

//   const safeName =
//     Date.now() +
//     "-" +
//     file.originalname
//       .replace(/[^\w.-]/g, "_");

//   cb(null, safeName);
// },
// });

// // File filter (extra safety layer)
// const fileFilter = (req, file, cb) => {
//   if (
//     file.mimetype === "application/pdf" ||
//     file.mimetype.startsWith("image/")
//   ) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only PDF and image files are allowed"), false);
//   }
// };

// const upload = multer({
//   storage,
//   fileFilter,
//   limits: {
//     fileSize: 20 * 1024 * 1024, // 20MB limit (optional safety)
//   },
// });

// module.exports = upload;

const multer = require("multer");
const path = require("path");
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB limit (optional safety)
  },
});

module.exports = upload;
