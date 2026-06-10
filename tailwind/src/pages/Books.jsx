

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

const Books = () => {
  const navigate = useNavigate();

  const { darkMode } = useTheme();

  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await axios.get("https://smart-reading-companion-1.onrender.com/api/books");

      setBooks(res.data.books || []);

    } catch (err) {
      console.log(err);
    }
  };

  const filteredBooks = books.filter((book) => {
    const text = search.toLowerCase();

    return (
      book.title?.toLowerCase().includes(text) ||
      book.author?.toLowerCase().includes(text) ||
      book.genre?.toLowerCase().includes(text) ||
      book.language?.toLowerCase().includes(text)
    );
  });

  return (
    <div
      className={`min-h-screen pb-28 transition-all duration-300 ${
        darkMode
          ? "bg-[#0f172a]"
          : "bg-gradient-to-br from-amber-100 via-orange-200 to-yellow-100"
      }`}
    >

      {/* HEADER */}
      <div className="px-6 pt-6">

        <h1
          className={`text-3xl font-bold ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Explore Books 📚
        </h1>

        <p
          className={`${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Discover your next favorite book
        </p>

      </div>

      {/* SEARCH */}
      <div className="px-6 mt-5 flex gap-3">

        <div
          className={`flex items-center backdrop-blur-xl px-4 py-3 rounded-xl w-full shadow-sm border ${
            darkMode
              ? "bg-white/10 border-white/10"
              : "bg-white/60 border-white/30"
          }`}
        >

          <Search
            size={18}
            className={`mr-2 ${
              darkMode ? "text-gray-300" : "text-gray-500"
            }`}
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search books..."
            className={`w-full bg-transparent outline-none ${
              darkMode
                ? "text-white placeholder:text-gray-400"
                : "text-black"
            }`}
          />

        </div>

        <button className="bg-orange-500 text-white px-4 rounded-xl">
          <Filter size={18} />
        </button>

      </div>

      {/* BOOK GRID */}
      <div className="px-6 mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">

        {filteredBooks.map((book) => (
          <motion.div
            key={book._id}
            whileHover={{ scale: 1.03 }}
            className={`backdrop-blur-xl p-3 rounded-2xl shadow cursor-pointer border transition-all ${
              darkMode
                ? "bg-white/10 border-white/10"
                : "bg-white/40 border-white/30"
            }`}
            onClick={() => navigate(`/book/${book._id}`)}
          >

            <img
              src={book.coverImage}
              className="h-40 w-full object-cover rounded-xl"
            />

            <h2
              className={`font-bold mt-2 text-sm ${
                darkMode ? "text-white" : "text-black"
              }`}
            >
              {book.title}
            </h2>

            <p
              className={`text-xs ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {book.author}
            </p>

          </motion.div>
        ))}

      </div>

      {/* EMPTY STATE */}
      {filteredBooks.length === 0 && (
        <div
          className={`text-center mt-10 ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          No books found 📚
        </div>
      )}

      {/* BOTTOM NAV */}
      <div className="fixed bottom-0 left-0 w-full px-4 pb-3">

        <div
          className={`backdrop-blur-2xl border rounded-3xl py-3 px-4 flex justify-between max-w-2xl mx-auto shadow-xl ${
            darkMode
              ? "bg-white/10 border-white/10"
              : "bg-white/40 border-white/30"
          }`}
        >

          <button
            onClick={() => navigate("/books")}
            className="flex flex-col items-center text-orange-500"
          >
            <BookOpen />
            <span className="text-xs mt-1">
              Books
            </span>
          </button>

          <button
            onClick={() => navigate("/progress")}
            className={`flex flex-col items-center ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            <BarChart3 />
            <span className="text-xs mt-1">
              Progress
            </span>
          </button>

          <button
            onClick={() => navigate("/library")}
            className={`flex flex-col items-center ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            <Library />
            <span className="text-xs mt-1">
              Library
            </span>
          </button>

          <button
            onClick={() => navigate("/ai")}
            className={`flex flex-col items-center ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            <Bot />
            <span className="text-xs mt-1">
              AI
            </span>
          </button>

          {/* <button
            onClick={() => navigate("/profile")}
            className={`flex flex-col items-center ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            <User />
            <span className="text-xs mt-1">
              Profile
            </span>
          </button> */}
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

    </div>
  );
};

export default Books;
