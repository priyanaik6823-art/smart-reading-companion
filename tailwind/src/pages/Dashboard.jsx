

//new2
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

import {
  BookOpen,
  BarChart3,
  Library,
  Bot,
  User,
  Search,
  Filter,
} from "lucide-react";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import UploadBook from "./UploadBook";

const Dashboard = () => {

  const navigate = useNavigate();

  const { darkMode } = useTheme();

  const [showUpload, setShowUpload] = useState(false);

  const [username, setUsername] = useState("Reader");

  const [books, setBooks] = useState([]);

  const recentBooks = books.slice(0, 4);

  const [search, setSearch] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
const [userResults, setUserResults] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  // ================= INIT USER =================
  useEffect(() => {

    if (!user?._id) {
      navigate("/login");
      return;
    }

    const name =
      (user.name?.charAt(0)?.toUpperCase() || "R") +
      (user.name?.slice(1) || "eader");

    setUsername(name);

    fetchBooks();

  }, []);

  // ================= FETCH BOOKS =================
  const fetchBooks = async () => {

    try {

      const res = await axios.get(
        "https://smart-reading-companion-1.onrender.com/api/books"
      );

      setBooks(res.data.books || []);

    } catch (err) {

      console.log(err);

    }
  };

  // ================= DELETE BOOK =================
  const handleDelete = async (bookId) => {

    try {

      await axios.delete(
        `https://smart-reading-companion-1.onrender.com/api/books/${bookId}`,
        {
          data: {
            userId: user._id,
          },
        }
      );

      fetchBooks();

    } catch (err) {

      console.log("Delete error:", err);

    }
  };

  // handle search 
  const handleSearch = async (e) => {
  const value = e.target.value;
  setSearch(value);

  // clear users if empty
  if (!value.trim()) {
    setUserResults([]);
    return;
  }

  // BOOK SEARCH is already handled locally (no API needed)

  // USER SEARCH (only if meaningful input)
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      `https://smart-reading-companion-1.onrender.com/api/user/search?query=${value}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setUserResults(res.data || []);
  } catch (err) {
    console.log(err);
  }
};

  // ================= SMART SEARCH =================
 const filteredBooks = books.filter((book) => {
  const searchText = search.toLowerCase();

  return (
    book.title?.toLowerCase().includes(searchText) ||
    book.author?.toLowerCase().includes(searchText) ||
    book.genre?.toLowerCase().includes(searchText) ||
    book.language?.toLowerCase().includes(searchText)
  );
});

  return (

   <div className="px-6 mt-5 flex gap-3 relative"
      className={`min-h-screen pb-28 transition duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-[#1a1a1a] via-[#111111] to-black text-white"
          : "bg-gradient-to-br from-amber-100 via-orange-200 to-yellow-100 text-gray-900"
      }`}
    >

      {/* ================= HEADER ================= */}
      <div className="px-6 pt-6 flex justify-between items-start">

        <div>

          <h1
            className={`text-3xl font-bold ${
              darkMode
                ? "text-white"
                : "text-gray-800"
            }`}
          >
            Hi {username} 👋
          </h1>

          <p
            className={`${
              darkMode
                ? "text-gray-300"
                : "text-gray-600"
            }`}
          >
            “Books are uniquely portable magic.”
          </p>

        </div>

        <button
          onClick={() => setShowUpload(true)}
          className="bg-orange-500 text-white px-4 py-2 rounded-2xl"
        >
          + Upload
        </button>

      </div>

      {/* ================= SEARCH BAR ================= */}
      <div className="px-6 mt-5 flex gap-3">

        <div
          className={`flex items-center backdrop-blur-xl px-4 py-3 rounded-xl w-full shadow-sm border ${
            darkMode
              ? "bg-white/5 border-white/10"
              : "bg-white/60 border-white/30"
          }`}
        >

          <Search
            size={18}
            className={`mr-2 ${
              darkMode
                ? "text-gray-300"
                : "text-gray-500"
            }`}
          />

          <input
            value={search}
           onChange={handleSearch}
            placeholder="Search title, author, genre, language..."
            className={`w-full bg-transparent outline-none ${
              darkMode
                ? "text-white"
                : "text-gray-700"
            }`}
          />
          {/* //search user */}

          {userResults.length > 0 && search.trim() && (
  <div className="absolute z-50 w-full top-14 left-6 right-6 bg-white shadow-lg rounded-lg max-h-64 overflow-y-auto">
    {userResults.map((user) => (
      <div
        key={user._id}
        onClick={() => {
          navigate(`/profile/${user._id}`);
          setUserResults([]);
          setSearch("");
        }}
        className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer"
      >
        <img
          src={
            user.profilePic
              ? `https://smart-reading-companion-1.onrender.com/${user.profilePic}`
              : "https://i.pravatar.cc/100"
          }
          className="w-10 h-10 rounded-full object-cover"
        />

        <div>
          <p className="font-semibold">{user.name}</p>
          <p className="text-xs opacity-70">{user.email}</p>
        </div>
      </div>
    ))}
  </div>
)}

{/* search user */}


        </div>

        <button className="bg-orange-500 text-white px-4 rounded-xl shadow-sm">

          <Filter size={18} />

        </button>

      </div>

      {/* ================= BOOKS ================= */}
      <div className="px-6 mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">

        {filteredBooks.map((book) => (

          <motion.div
            key={book._id}
            whileHover={{ scale: 1.03 }}
            className={`backdrop-blur-xl p-3 rounded-2xl shadow cursor-pointer border ${
              darkMode
                ? "bg-white/5 border-white/10"
                : "bg-white/40 border-white/30"
            }`}
            onClick={() => navigate(`/book/${book._id}`)}
          >

            <img
              src={`https://smart-reading-companion-1.onrender.com${book.coverImage}`}
              className="h-40 w-full object-cover rounded-xl"
            />

            <h2
              className={`font-bold mt-2 text-sm ${
                darkMode
                  ? "text-white"
                  : "text-gray-800"
              }`}
            >
              {book.title}
            </h2>

            <p
              className={`text-xs mt-1 ${
                darkMode
                  ? "text-gray-300"
                  : "text-gray-600"
              }`}
            >
              {book.author}
            </p>

            {/* ================= GENRE + LANGUAGE ================= */}
            <div className="flex gap-2 mt-2 flex-wrap">

              <span className="bg-orange-100 text-orange-700 text-[10px] px-2 py-1 rounded-full">
                {book.genre}
              </span>

              <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-1 rounded-full">
                {book.language}
              </span>

            </div>

            {/* ================= RATING ================= */}
            <p
  className={`text-[11px] mt-2 ${
    darkMode
      ? "text-gray-400"
      : "text-gray-500"
  }`}
>
  {book.reviews?.length > 0 ? (
    <>
      ⭐ {book.rating || 0} • {book.reviews.length} reviews
    </>
  ) : (
    "No ratings and reviews yet"
  )}
</p>

            {/* ================= DELETE BUTTON ================= */}
            {String(book.uploadedBy) === String(user._id) && (

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(book._id);
                }}
                className="text-red-500 text-xs mt-3"
              >
                Delete
              </button>

            )}

          </motion.div>
        ))}

        {/* ================= EMPTY STATE ================= */}
        {filteredBooks.length === 0 && (

          <div
            className={`col-span-full text-center mt-10 ${
              darkMode
                ? "text-gray-400"
                : "text-gray-500"
            }`}
          >
            No books found 📚
          </div>

        )}

      </div>

      {/* ================= STATS ================= */}
      <div className="px-6 mt-6 grid grid-cols-2 gap-4">

        <div
          className={`p-4 rounded-2xl backdrop-blur-xl border ${
            darkMode
              ? "bg-white/5 border-white/10"
              : "bg-white/40 border-white/30"
          }`}
        >

          <p
            className={`${
              darkMode
                ? "text-gray-300"
                : "text-gray-600"
            }`}
          >
            Books
          </p>

          <h2 className="text-2xl font-bold">
            {books.length}
          </h2>

        </div>

        <div
          className={`p-4 rounded-2xl backdrop-blur-xl border ${
            darkMode
              ? "bg-white/5 border-white/10"
              : "bg-white/40 border-white/30"
          }`}
        >

          <p
            className={`${
              darkMode
                ? "text-gray-300"
                : "text-gray-600"
            }`}
          >
            Status
          </p>

          <h2 className="text-2xl font-bold">
            Active
          </h2>

        </div>

      </div>

      {/* ================= BOTTOM NAV ================= */}
      <div className="fixed bottom-0 left-0 w-full px-4 pb-3">

        <div
          className={`backdrop-blur-2xl border rounded-3xl py-3 px-4 flex justify-between max-w-2xl mx-auto shadow-xl ${
            darkMode
              ? "bg-white/5 border-white/10"
              : "bg-white/40 border-white/30"
          }`}
        >

          <button
            onClick={() => navigate("/books")}
            className={`flex flex-col items-center ${
              darkMode
                ? "text-white"
                : "text-gray-700"
            }`}
          >
            <BookOpen />
            <span className="text-xs">
              Books
            </span>
          </button>

          <button
            onClick={() => navigate("/progress")}
            className={`flex flex-col items-center ${
              darkMode
                ? "text-white"
                : "text-gray-700"
            }`}
          >
            <BarChart3 />
            <span className="text-xs">
              Progress
            </span>
          </button>

          <button
            onClick={() => navigate("/library")}
            className={`flex flex-col items-center ${
              darkMode
                ? "text-white"
                : "text-gray-700"
            }`}
          >
            <Library />
            <span className="text-xs">
              Library
            </span>
          </button>

          <button
            onClick={() => navigate("/ai")}
            className={`flex flex-col items-center ${
              darkMode
                ? "text-white"
                : "text-gray-700"
            }`}
          >
            <Bot />
            <span className="text-xs">
              AI
            </span>
          </button>

         <button
  onClick={() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user?._id) return;

    navigate(`/profile/${user._id}`);
  }}
  className={`flex flex-col items-center ${
    darkMode
      ? "text-white"
      : "text-gray-700"
  }`}
>
  <User />
  <span className="text-xs">
    Profile
  </span>
</button>

        </div>

      </div>

      {/* ================= UPLOAD MODAL ================= */}
      {showUpload && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

          <div
            className={`p-6 rounded-2xl w-[90%] max-w-xl ${
              darkMode
                ? "bg-[#1a1a1a] text-white"
                : "bg-white text-black"
            }`}
          >

            <UploadBook />

            <button
              onClick={() => setShowUpload(false)}
              className="mt-4 text-red-500"
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>
  );
};

export default Dashboard;
