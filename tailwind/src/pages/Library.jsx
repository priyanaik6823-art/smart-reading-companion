
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import {
  BookOpen,
  BarChart3,
  Library as LibraryIcon,
  Bot,
  User,
} from "lucide-react";

import axios from "axios";
import { useNavigate } from "react-router-dom";

const Library = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const [libraryBooks, setLibraryBooks] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  // ================= FETCH LIBRARY BOOKS =================
  useEffect(() => {
    fetchLibraryBooks();
  }, []);

  const fetchLibraryBooks = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/library/${user._id}`
      );

      setLibraryBooks(res.data.libraryBooks);

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className={`min-h-screen relative overflow-hidden transition-all duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e293b]"
          : "bg-gradient-to-br from-amber-100 via-orange-200 to-yellow-100"
      }`}
    >

      {/* Glow Effects */}
      <div
        className={`absolute top-0 left-0 w-72 h-72 blur-3xl opacity-30 rounded-full ${
          darkMode ? "bg-orange-500" : "bg-orange-300"
        }`}
      ></div>

      <div
        className={`absolute bottom-0 right-0 w-72 h-72 blur-3xl opacity-30 rounded-full ${
          darkMode ? "bg-pink-500" : "bg-pink-300"
        }`}
      ></div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 px-4 md:px-6 py-5 pb-32 max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">

          <motion.h1
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-3xl md:text-5xl font-extrabold ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            My Library 📚
          </motion.h1>

          <p
            className={`mt-2 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Your personal reading collection
          </p>

        </div>

        {/* OVERVIEW CARDS */}
        <div className="grid grid-cols-2 gap-4 mb-6">

          {/* COMPLETED */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className={`backdrop-blur-xl border rounded-3xl p-5 shadow-xl ${
              darkMode
                ? "bg-white/10 border-white/10"
                : "bg-white/30 border-white/40"
            }`}
          >

            <p
              className={`text-sm ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Books Completed
            </p>

            <h2
              className={`text-3xl font-bold mt-2 ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              {
                libraryBooks.filter(
                  (item) => item.status === "completed"
                ).length
              }
            </h2>

          </motion.div>

          {/* READING */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className={`backdrop-blur-xl border rounded-3xl p-5 shadow-xl ${
              darkMode
                ? "bg-white/10 border-white/10"
                : "bg-white/30 border-white/40"
            }`}
          >

            <p
              className={`text-sm ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Currently Reading
            </p>

            <h2
              className={`text-3xl font-bold mt-2 ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              {
                libraryBooks.filter(
                  (item) => item.status === "reading"
                ).length
              }
            </h2>

          </motion.div>

        </div>

        {/* CURRENTLY READING */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className={`backdrop-blur-xl border rounded-3xl p-6 shadow-2xl mb-6 ${
            darkMode
              ? "bg-white/10 border-white/10"
              : "bg-white/30 border-white/40"
          }`}
        >

          <h2
            className={`text-2xl font-bold mb-4 ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Currently Reading
          </h2>

          <div className="space-y-4">

            {libraryBooks
              .filter((item) => item.status === "reading")
              .map((item) => (

                <div
                  key={item._id}
                  className={`rounded-2xl p-4 flex gap-4 ${
                    darkMode ? "bg-white/10" : "bg-white/40"
                  }`}
                >

                  <img
                    src={`http://localhost:5000${item.bookId?.coverImage}`}
                    alt="Book"
                    className="w-24 h-32 rounded-2xl object-cover"
                  />

                  <div>

                    <h3
                      className={`text-xl font-bold ${
                        darkMode ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {item.bookId?.title}
                    </h3>

                    <p
                      className={`mt-1 ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {item.bookId?.author}
                    </p>

                    <p className="text-sm text-orange-500 mt-3">
                      Reading in progress...
                    </p>

                  </div>

                </div>
              ))}

            {libraryBooks.filter(
              (item) => item.status === "reading"
            ).length === 0 && (
              <p
                className={`${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                No books currently being read
              </p>
            )}

          </div>

        </motion.div>

        {/* COMPLETED BOOKS */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className={`backdrop-blur-xl border rounded-3xl p-6 shadow-2xl mb-6 ${
            darkMode
              ? "bg-white/10 border-white/10"
              : "bg-white/30 border-white/40"
          }`}
        >

          <h2
            className={`text-2xl font-bold mb-4 ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Completed Books
          </h2>

          <div className="space-y-3">

            {libraryBooks
              .filter((item) => item.status === "completed")
              .map((item) => (
                <div
                  key={item._id}
                  className={`rounded-2xl p-4 font-medium ${
                    darkMode
                      ? "bg-white/10 text-white"
                      : "bg-white/40 text-gray-800"
                  }`}
                >
                  ✅ {item.bookId?.title}
                </div>
              ))}

            {libraryBooks.filter(
              (item) => item.status === "completed"
            ).length === 0 && (
              <p
                className={`${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                No completed books yet
              </p>
            )}

          </div>

        </motion.div>

        {/* NEXT UP */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className={`backdrop-blur-xl border rounded-3xl p-6 shadow-2xl ${
            darkMode
              ? "bg-white/10 border-white/10"
              : "bg-white/30 border-white/40"
          }`}
        >

          <h2
            className={`text-2xl font-bold mb-4 ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Next Up
          </h2>

          <div className="space-y-3">

            {libraryBooks
              .filter((item) => item.status === "yet_to_read")
              .map((item) => (
                <div
                  key={item._id}
                  className={`rounded-2xl p-4 font-medium ${
                    darkMode
                      ? "bg-white/10 text-white"
                      : "bg-white/40 text-gray-800"
                  }`}
                >
                  📖 {item.bookId?.title}
                </div>
              ))}

            {libraryBooks.filter(
              (item) => item.status === "yet_to_read"
            ).length === 0 && (
              <p
                className={`${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                No upcoming books
              </p>
            )}

          </div>

        </motion.div>

      </div>

      {/* BOTTOM NAVIGATION */}
      <div className="fixed bottom-0 left-0 w-full z-50 px-3 md:px-4 pb-3 md:pb-4">

        <div
          className={`backdrop-blur-2xl border rounded-3xl py-3 md:py-4 px-4 md:px-6 shadow-2xl flex justify-between items-center max-w-2xl mx-auto ${
            darkMode
              ? "bg-white/10 border-white/10"
              : "bg-white/30 border-white/40"
          }`}
        >

          {/* BOOKS */}
          <button
            onClick={() => navigate("/books")}
            className={`flex flex-col items-center ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            <BookOpen size={22} />
            <span className="text-[10px] md:text-xs mt-1">
              Books
            </span>
          </button>

          {/* PROGRESS */}
          <button
            onClick={() => navigate("/progress")}
            className={`flex flex-col items-center ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            <BarChart3 size={22} />
            <span className="text-[10px] md:text-xs mt-1">
              Progress
            </span>
          </button>

          {/* LIBRARY */}
          <button
            onClick={() => navigate("/library")}
            className="flex flex-col items-center text-orange-500"
          >
            <LibraryIcon size={22} />
            <span className="text-[10px] md:text-xs mt-1">
              Library
            </span>
          </button>

          {/* AI */}
          <button
            onClick={() => navigate("/ai")}
            className={`flex flex-col items-center ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            <Bot size={22} />
            <span className="text-[10px] md:text-xs mt-1">
              AI
            </span>
          </button>

          {/* PROFILE */}
          {/* <button
            onClick={() => navigate(`/profile/${localStorage.getItem("userId")}`)}
            className={`flex flex-col items-center ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            <User size={22} />
            <span className="text-[10px] md:text-xs mt-1">
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

export default Library;