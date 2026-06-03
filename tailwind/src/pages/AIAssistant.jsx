
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

import {
  BookOpen,
  Library,
  Bot,
  User,
  Send,
  Loader2,
} from "lucide-react";

import axios from "axios";
import { useNavigate } from "react-router-dom";

const Assistant = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hello 👋 I am your AI Reading Assistant. Ask me anything about books, reading, productivity, or learning.",
    },
  ]);

  const messagesEndRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // Send message
  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage = {
      role: "user",
      text: message,
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentMessage = message;

    setMessage("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/assistant/chat",
        {
          message: currentMessage,
        }
      );

      const aiMessage = {
        role: "assistant",
        text: response.data.reply,
      };

      setMessages((prev) => [...prev, aiMessage]);

    } catch (error) {
      console.log(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Something went wrong. Please try again.",
        },
      ]);
    }

    setLoading(false);
  };

  // Enter key support
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div
      className={`min-h-screen flex transition-all duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e293b]"
          : "bg-[#f8f5f0]"
      }`}
    >

      {/* Sidebar */}
      <div
        className={`w-20 flex flex-col items-center py-6 gap-8 shadow-sm border-r ${
          darkMode
            ? "bg-[#111827] border-white/10"
            : "bg-white border-[#e5ddd5]"
        }`}
      >

        <motion.div
          whileHover={{ scale: 1.1 }}
          className={`cursor-pointer ${
            darkMode ? "text-orange-400" : "text-[#6f5637]"
          }`}
          onClick={() => navigate("/dashboard")}
        >
          <BookOpen size={28} />
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.1 }}
          className={`cursor-pointer ${
            darkMode ? "text-orange-400" : "text-[#6f5637]"
          }`}
          onClick={() => navigate("/books")}
        >
          <Library size={28} />
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.1 }}
          className="cursor-pointer text-orange-500"
        >
          <Bot size={30} />
        </motion.div>

        <motion.div
  whileHover={{ scale: 1.1 }}
  className={`cursor-pointer mt-auto ${
    darkMode ? "text-orange-400" : "text-[#6f5637]"
  }`}
  onClick={() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user?._id) return;

    navigate(`/profile/${user._id}`);
  }}
>
  <User size={28} />
</motion.div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <div
          className={`p-5 shadow-sm border-b ${
            darkMode
              ? "bg-[#111827] border-white/10"
              : "bg-white border-[#e5ddd5]"
          }`}
        >
          <h1
            className={`text-2xl font-bold flex items-center gap-3 ${
              darkMode ? "text-white" : "text-[#5c4432]"
            }`}
          >
            <Bot className="text-orange-500" />
            AI Reading Assistant
          </h1>

          <p
            className={`text-sm mt-1 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Ask about books, summaries, productivity, learning, and more.
          </p>
        </div>

        {/* Messages */}
        <div
          className={`flex-1 overflow-y-auto p-6 space-y-6 ${
            darkMode ? "bg-[#0f172a]" : "bg-[#f8f5f0]"
          }`}
        >

          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${
                  msg.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] px-5 py-4 rounded-2xl shadow-md whitespace-pre-wrap leading-relaxed ${
                    msg.role === "user"
                      ? "bg-orange-500 text-white"
                      : darkMode
                      ? "bg-white/10 text-white"
                      : "bg-[#efe7dc] text-gray-800"
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div
                className={`px-5 py-4 rounded-2xl flex items-center gap-3 shadow-md ${
                  darkMode
                    ? "bg-white/10 text-white"
                    : "bg-[#efe7dc] text-gray-700"
                }`}
              >
                <Loader2 className="animate-spin" size={20} />
                AI is thinking...
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef}></div>
        </div>

        {/* Input */}
        <div
          className={`p-5 flex gap-4 shadow-sm border-t ${
            darkMode
              ? "bg-[#111827] border-white/10"
              : "bg-white border-[#e5ddd5]"
          }`}
        >

          <input
            type="text"
            placeholder="Ask something about books..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`flex-1 rounded-xl px-5 py-4 outline-none transition border ${
              darkMode
                ? "bg-white/10 border-white/10 text-white placeholder:text-gray-400 focus:border-orange-400"
                : "bg-[#f5efe6] border-[#ddd6ce] text-gray-800 focus:border-[#8b6f47] focus:ring-2 focus:ring-[#d6c3ae]"
            }`}
          />

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 transition px-6 rounded-xl flex items-center justify-center text-white shadow-md"
          >
            <Send size={22} />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Assistant;