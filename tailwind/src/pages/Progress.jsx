
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

import {
  BookOpen,
  BarChart3,
  Library,
  Bot,
  User,
} from "lucide-react";

import axios from "axios";
import { useNavigate } from "react-router-dom";


const Progress = () => {

  const navigate = useNavigate();

  const { darkMode } = useTheme();

  const [progressData, setProgressData] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  const userId = user?._id;
  

  console.log("USER FROM STORAGE:", user);
  console.log("USER ID:", userId);

  // ✅ FETCH PROGRESS ONLY
  useEffect(() => {

    if (!userId) return;

    fetchProgress();

  }, [userId]);

  const fetchProgress = async () => {

    try {

      const res = await axios.get(
        `https://smart-reading-companion-1.onrender.com/api/progress/user/${userId}`
      );

      setProgressData(res.data);

    } catch (err) {

      console.log("Progress fetch error:", err);

    }
  };

  return (

    <div
      className={`min-h-screen relative overflow-hidden transition duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-[#1a1a1a] via-[#111111] to-black text-white"
          : "bg-gradient-to-br from-amber-100 via-orange-200 to-yellow-100 text-gray-900"
      }`}
    >

      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-orange-300 blur-3xl opacity-30 rounded-full"></div>

      <div className="absolute bottom-0 right-0 w-72 h-72 bg-pink-300 blur-3xl opacity-30 rounded-full"></div>

      {/* MAIN */}
      <div className="relative z-10 px-4 md:px-6 py-5 pb-32 max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">

          <motion.h1
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-3xl md:text-5xl font-extrabold ${
              darkMode
                ? "text-white"
                : "text-gray-800"
            }`}
          >
            Reading Progress 📈
          </motion.h1>

          <p
            className={`mt-2 ${
              darkMode
                ? "text-gray-300"
                : "text-gray-700"
            }`}
          >
            Track your real reading journey
          </p>

        </div>

        {/* EMPTY STATE */}
        {progressData.length === 0 ? (

          <div
            className={`backdrop-blur-xl border rounded-3xl p-8 shadow-2xl ${
              darkMode
                ? "bg-white/5 border-white/10"
                : "bg-white/30 border-white/40"
            }`}
          >

            <p
              className={`text-lg ${
                darkMode
                  ? "text-gray-300"
                  : "text-gray-700"
              }`}
            >
              No reading progress yet 📚
            </p>

          </div>

        ) : (

          <div className="grid gap-6">

            {progressData.map((item) => {

              // ✅ IMPORTANT FIX: book is already populated object
              const book = item.bookId;

              const percentage =
                item.totalPages > 0
                  ? Math.floor(
                      (item.currentPage / item.totalPages) * 100
                    )
                  : 0;

              return (

                <motion.div
                  key={item._id}
                  whileHover={{ scale: 1.01 }}
                  className={`backdrop-blur-xl border rounded-3xl p-6 shadow-2xl ${
                    darkMode
                      ? "bg-white/5 border-white/10"
                      : "bg-white/30 border-white/40"
                  }`}
                >

                  <div className="flex gap-5 items-center">

                    {/* COVER */}
                    {book?.coverImage && (

                      <img
                        src={book.coverImage}
                        alt={book?.title}
                        className="w-28 h-40 object-cover rounded-2xl shadow-lg"
                      />

                    )}

                    {/* INFO */}
                    <div className="flex-1">

                      <div className="flex justify-between items-center mb-3">

                        <div>

                          <h2
                            className={`text-2xl font-bold ${
                              darkMode
                                ? "text-white"
                                : "text-gray-800"
                            }`}
                          >
                            {book?.title || "Unknown Book"}
                          </h2>

                          <p
                            className={`${
                              darkMode
                                ? "text-gray-300"
                                : "text-gray-600"
                            }`}
                          >
                            {book?.author || "Unknown Author"}
                          </p>

                        </div>

                        <div className="text-3xl font-bold text-orange-600">
                          {percentage}%
                        </div>

                      </div>

                      {/* PROGRESS BAR */}
                      <div
                        className={`w-full rounded-full h-4 overflow-hidden ${
                          darkMode
                            ? "bg-white/10"
                            : "bg-white/50"
                        }`}
                      >

                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.8 }}
                          className="h-full bg-gradient-to-r from-orange-500 to-pink-500 rounded-full"
                        />

                      </div>

                      <p
                        className={`text-sm mt-3 ${
                          darkMode
                            ? "text-gray-300"
                            : "text-gray-700"
                        }`}
                      >
                        {item.currentPage} / {item.totalPages} pages completed
                      </p>

                      <p
                        className={`text-xs mt-1 ${
                          darkMode
                            ? "text-gray-400"
                            : "text-gray-500"
                        }`}
                      >
                        Last opened:{" "}
                        {item.lastOpened
                          ? new Date(item.lastOpened).toLocaleString()
                          : "N/A"}
                      </p>

                      {/* continue reading button */}
                      <button
                        onClick={() =>
                          navigate("/read", {
                            state: {
                              pdfUrl: `{book.pdfFile}`,
                              bookId: book._id,
                              totalPages: item.totalPages,
                            },
                          })
                        }
                        className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl transition"
                      >
                        Continue Reading 📖
                      </button>

                    </div>

                  </div>

                </motion.div>
              );
            })}

          </div>
        )}
      </div>

      {/* BOTTOM NAV */}
      <div className="fixed bottom-0 left-0 w-full z-50 px-3 md:px-4 pb-3 md:pb-4">

        <div
          className={`backdrop-blur-2xl border rounded-3xl py-3 md:py-4 px-4 md:px-6 shadow-2xl flex justify-between items-center max-w-2xl mx-auto ${
            darkMode
              ? "bg-white/5 border-white/10"
              : "bg-white/30 border-white/40"
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

            <BookOpen size={22} />

            <span className="text-xs mt-1">
              Books
            </span>

          </button>

          <button className="flex flex-col items-center text-orange-600">

            <BarChart3 size={22} />

            <span className="text-xs mt-1">
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

            <Library size={22} />

            <span className="text-xs mt-1">
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

            <Bot size={22} />

            <span className="text-xs mt-1">
              AI
            </span>

          </button>

          {/* <button
            onClick={() => navigate(`/profile/${localStorage.getItem("userId")}`)}
            className={`flex flex-col items-center ${
              darkMode
                ? "text-white"
                : "text-gray-700"
            }`}
          >

            <User size={22} />

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

export default Progress;
