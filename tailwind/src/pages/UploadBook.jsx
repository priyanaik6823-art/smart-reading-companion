

//new code
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const UploadBook = () => {
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useTheme();

  const user = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "",
    language: "",
    totalPages: "",
    description: "",
    userId: JSON.parse(localStorage.getItem("user"))._id
  });

  const [pdfFile, setPdfFile] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= UPLOAD BOOK =================
  const handleUpload = async () => {
    try {
      setLoading(true);
      setMessage("");

      // validation
      if (
        !form.title ||
        !form.author ||
        !form.genre ||
        !form.language ||
        !form.totalPages ||
        !form.description
      ) {
        setMessage("❌ Please fill all fields");
        setLoading(false);
        return;
      }

      if (!pdfFile || !coverImage) {
        setMessage("❌ Please upload PDF and Cover Image");
        setLoading(false);
        return;
      }

      const data = new FormData();

      // ================= TEXT DATA =================
      data.append("title", form.title);
      data.append("author", form.author);
      data.append("genre", form.genre);
      data.append("language", form.language);
      data.append("totalPages", form.totalPages);
      data.append("description", form.description);

      // ⭐ IMPORTANT FIX: USER ID ADDED
      data.append("userId", user?._id);

      // ================= FILES =================
      data.append("pdfFile", pdfFile);
      data.append("coverImage", coverImage);

      const res = await axios.post(
        "https://smart-reading-companion-1.onrender.com/api/books",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("UPLOAD SUCCESS:", res.data);

      setMessage("📚 Book uploaded successfully!");

      // ================= RESET FORM =================
      setForm({
        title: "",
        author: "",
        genre: "",
        language: "",
        totalPages: "",
        description: "",
      });

      setPdfFile(null);
      setCoverImage(null);

      // ================= REFRESH SAFE NAV =================
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);

    } catch (err) {
      console.log("UPLOAD ERROR:", err.response?.data || err.message);
      setMessage("❌ Upload failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-200 to-yellow-100 flex items-center justify-center p-4">

      <div className="w-full max-w-xl bg-white/30 backdrop-blur-xl p-6 rounded-2xl shadow-xl space-y-4">

        <h2 className="text-xl font-bold text-gray-800">
          Upload Book
        </h2>

        {message && (
          <p className="text-sm text-center font-medium text-gray-700">
            {message}
          </p>
        )}

        {/* TEXT FIELDS */}
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full p-2 rounded"
          placeholder="Title"
        />

        <input
          name="author"
          value={form.author}
          onChange={handleChange}
          className="w-full p-2 rounded"
          placeholder="Author"
        />

        <div className="grid grid-cols-2 gap-2">
          <input
            name="genre"
            value={form.genre}
            onChange={handleChange}
            className="p-2 rounded"
            placeholder="Genre"
          />

          <input
            name="language"
            value={form.language}
            onChange={handleChange}
            className="p-2 rounded"
            placeholder="Language"
          />
        </div>

        <input
          name="totalPages"
          value={form.totalPages}
          onChange={handleChange}
          className="w-full p-2 rounded"
          placeholder="Total Pages"
        />

        {/* PDF UPLOAD */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">
            Upload PDF File
          </p>

          <label className="cursor-pointer bg-white/40 backdrop-blur-xl border border-white/30 p-3 rounded-xl block text-gray-700 text-sm hover:bg-white/60 transition">
            📄 Click to upload PDF

            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setPdfFile(e.target.files[0])}
              className="hidden"
            />
          </label>

          {pdfFile && (
            <p className="text-xs text-gray-600">
              Selected: {pdfFile.name}
            </p>
          )}
        </div>

        {/* COVER UPLOAD */}
        <div className="space-y-2 mt-3">
          <p className="text-sm font-medium text-gray-700">
            Upload Cover Image
          </p>

          <label className="cursor-pointer bg-white/40 backdrop-blur-xl border border-white/30 p-3 rounded-xl block text-gray-700 text-sm hover:bg-white/60 transition">
            🖼 Click to upload Image

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files[0])}
              className="hidden"
            />
          </label>

          {coverImage && (
            <p className="text-xs text-gray-600">
              Selected: {coverImage.name}
            </p>
          )}
        </div>

        {/* DESCRIPTION */}
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full p-2 rounded"
          placeholder="Description"
          rows={3}
        />

        {/* BUTTON */}
        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full bg-orange-500 text-white py-2 rounded-xl font-semibold"
        >
          {loading ? "Uploading..." : "Upload Book"}
        </button>

        <button
          onClick={() => navigate("/dashboard")}
          className="w-full bg-gray-200 text-gray-700 py-2 rounded-xl"
        >
          Exit
        </button>

      </div>
    </div>
  );
};

export default UploadBook;
