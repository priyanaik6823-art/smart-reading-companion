
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";

const BookDetails = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const user = JSON.parse(localStorage.getItem("user"));

  const [book, setBook] = useState(null);
  const [progress, setProgress] = useState(null);

  const [rating, setRating] = useState(5);

  const [comment, setComment] = useState("");

  const [reviews, setReviews] = useState([]);

  // ================= FETCH BOOK =================
  useEffect(() => {
    fetchBook();
    fetchProgress();
    fetchReviews();
  }, []);

  const fetchBook = async () => {
    try {
      const res = await axios.get(
        `https://smart-reading-companion-1.onrender.com/api/books/${id}`
      );

      setBook(res.data.book);

    } catch (err) {
      console.log(err);
    }
  };

  // ================= FETCH PROGRESS =================
  const fetchProgress = async () => {
    try {

      const res = await axios.get(
        `https://smart-reading-companion-1.onrender.com/progress/user/${user._id}/book/${id}`
      );

      setProgress(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  // ================= FETCH REVIEWS =================
  const fetchReviews = async () => {
    try {

      const res = await axios.get(
        `https://smart-reading-companion-1.onrender.com/api/reviews/${id}`
      );

      setReviews(res.data.reviews);

    } catch (err) {
      console.log(err);
    }
  };

  // ================= ADD TO LIBRARY =================
  const addToLibrary = async () => {
    try {

      const res = await axios.post(
        "https://smart-reading-companion-1.onrender.com/api/library/add",
        {
          userId: user._id,
          bookId: book._id,
        }
      );

      alert(res.data.message);

    } catch (err) {
      console.log(err);

      alert("Failed to add book");
    }
  };

  // ================= SUBMIT REVIEW =================
  const submitReview = async () => {
    try {

      const res = await axios.post(
        "https://smart-reading-companion-1.onrender.com/api/reviews/add",
        {
          userId: user._id,
          bookId: id,
          rating,
          comment,
        }
      );

      alert(res.data.message);

      fetchReviews();
      fetchBook();

    } catch (err) {

      console.log(err);

      alert(
        err.response?.data?.message ||
        "Failed to submit review"
      );
    }
  };

  if (!book) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          darkMode
            ? "bg-[#0f172a] text-white"
            : "bg-gradient-to-br from-amber-100 via-orange-200 to-yellow-100 text-black"
        }`}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen p-6 transition-all duration-300 ${
        darkMode
          ? "bg-[#0f172a]"
          : "bg-gradient-to-br from-amber-100 via-orange-200 to-yellow-100"
      }`}
    >

      {/* COVER + INFO */}
      <div
        className={`max-w-5xl mx-auto backdrop-blur-xl rounded-3xl p-6 shadow-lg border ${
          darkMode
            ? "bg-white/10 border-white/10"
            : "bg-white/40 border-white/30"
        }`}
      >

        <div className="grid md:grid-cols-2 gap-8">

          {/* COVER */}
          <div>
            <img
              src={`https://smart-reading-companion-1.onrender.com${book.coverImage}`}
              className="w-full max-h-[700px] object-contain rounded-2xl bg-white"
            />
          </div>

          {/* DETAILS */}
          <div>

            <h1
              className={`text-4xl font-bold ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              {book.title}
            </h1>

            <p
              className={`text-lg mt-2 ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              by {book.author}
            </p>

            {/* TAGS */}
            <div className="flex gap-3 mt-4 flex-wrap">

              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
                {book.genre}
              </span>

              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                {book.language}
              </span>

            </div>

            {/* RATING */}
           
<div className="mt-5">
  <p
    className={`text-lg ${
      darkMode ? "text-gray-300" : "text-gray-700"
    }`}
  >
    {reviews.length > 0 ? (
      <>
        ⭐ {book.rating || 0} ({reviews.length} reviews)
      </>
    ) : (
      "No ratings and reviews yet"
    )}
  </p>
</div>

            {/* TOTAL PAGES */}
            <div className="mt-3">
              <p
                className={`${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                📖 {book.totalPages} Pages
              </p>
            </div>

            {/* DESCRIPTION */}
            <div className="mt-6">

              <h2
                className={`text-2xl font-bold mb-2 ${
                  darkMode ? "text-white" : "text-black"
                }`}
              >
                Synopsis
              </h2>

              <p
                className={`leading-7 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {book.description}
              </p>

            </div>

            {/* BUTTONS */}
            <div className="flex gap-4 mt-8 flex-wrap">

              <button
                onClick={() =>
                  navigate("/read", {
                    state: {
                      pdfUrl: `http://localhost:5000${book.pdfFile}`,
                      bookId: book._id,
                      totalPages: book.totalPages,
                    },
                  })
                }
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl transition"
              >
                Read Book
              </button>

              <button
                onClick={addToLibrary}
                className={`px-6 py-3 rounded-2xl transition ${
                  darkMode
                    ? "bg-white/10 text-white border border-white/10 hover:bg-white/20"
                    : "bg-white text-gray-800"
                }`}
              >
                Add to Library
              </button>
              {/* uploaded by button */}
              <div
  onClick={() =>
    navigate(`/profile/${book.uploadedBy?._id}`)
  }
  className={`flex items-center gap-3 mt-4 p-3 rounded-2xl cursor-pointer transition ${
    darkMode
      ? "bg-white/10 hover:bg-white/20"
      : "bg-black/5 hover:bg-black/10"
  }`}
>

  <img
    src={
      book.uploadedBy?.profilePic
        ? `http://localhost:5000/${book.uploadedBy.profilePic}`
        : "https://i.pravatar.cc/150"
    }
    className="w-12 h-12 rounded-full object-cover border-2 border-white"
  />

  <div>
    <p className="text-sm opacity-70">
      Uploaded by
    </p>

    <h3 className="font-bold text-lg hover:underline">
      {book.uploadedBy?.name}
    </h3>
  </div>

</div>

            </div>

            {/* ================= REVIEW SECTION ================= */}
            <div className="mt-10">

              <h2
                className={`text-2xl font-bold mb-4 ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Community Reviews
              </h2>

              {/* REVIEW LOCK */}
              {(!progress || progress.currentPage < 10) ? (

                <div
                  className={`p-5 rounded-2xl ${
                    darkMode
                      ? "bg-white/10 text-gray-300"
                      : "bg-white/40 text-gray-700"
                  }`}
                >
                  📖 Read at least 10 pages to review this book
                </div>

              ) : (

                <div
                  className={`p-5 rounded-2xl ${
                    darkMode
                      ? "bg-white/10"
                      : "bg-white/40"
                  }`}
                >

                  {/* RATING */}
                  <div>

                    <label
                      className={`font-semibold ${
                        darkMode
                          ? "text-gray-200"
                          : "text-gray-700"
                      }`}
                    >
                      Rating
                    </label>

                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className={`w-full mt-2 p-3 rounded-xl outline-none ${
                        darkMode
                          ? "bg-[#1e293b] text-white"
                          : "bg-white text-black"
                      }`}
                    >
                      <option value={1}>1 Star</option>
                      <option value={2}>2 Stars</option>
                      <option value={3}>3 Stars</option>
                      <option value={4}>4 Stars</option>
                      <option value={5}>5 Stars</option>
                    </select>

                  </div>

                  {/* COMMENT */}
                  <div className="mt-4">

                    <label
                      className={`font-semibold ${
                        darkMode
                          ? "text-gray-200"
                          : "text-gray-700"
                      }`}
                    >
                      Review
                    </label>

                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Write your thoughts..."
                      className={`w-full mt-2 p-3 rounded-xl outline-none min-h-[120px] ${
                        darkMode
                          ? "bg-[#1e293b] text-white placeholder:text-gray-400"
                          : "bg-white text-black"
                      }`}
                    />

                  </div>

                  {/* SUBMIT */}
                  <button
                    onClick={submitReview}
                    className="mt-5 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl transition"
                  >
                    Submit Review
                  </button>

                </div>

              )}

              {/* ALL REVIEWS */}
              <div className="space-y-4 mt-6">

                {reviews.map((item) => (

                  <div
                    key={item._id}
                    className={`p-5 rounded-2xl ${
                      darkMode
                        ? "bg-white/10"
                        : "bg-white/40"
                    }`}
                  >

                    <div className="flex justify-between items-center">

                      <h3
  onClick={() => {
  const userId = item.userId?._id || item.userId;

  if (!userId) return;

  navigate(`/profile/${userId}`);
}}
  className={`font-bold cursor-pointer hover:underline ${
    darkMode ? "text-white" : "text-gray-800"
  }`}
>
 {item.userId?.name || "User"}
</h3>

                      <p className="text-orange-600 font-semibold">
                        ⭐ {item.rating}
                      </p>

                    </div>

                    <p
                      className={`mt-3 ${
                        darkMode
                          ? "text-gray-300"
                          : "text-gray-700"
                      }`}
                    >
                      {item.comment}
                    </p>

                  </div>
                ))}

                {reviews.length === 0 && (
                  <p
                    className={`${
                      darkMode
                        ? "text-gray-400"
                        : "text-gray-600"
                    }`}
                  >
                    No reviews yet
                  </p>
                )}

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default BookDetails;
