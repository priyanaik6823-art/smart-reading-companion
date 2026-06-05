
import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

export default function AuthPage() {
  const { darkMode } = useTheme();

  const [isLogin, setIsLogin] = useState(true);

  const [showOTP, setShowOTP] = useState(false);

  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const [showResetPassword, setShowResetPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    otp: "",
    newPassword: "",
  });

  const floatingBooks = Array.from({ length: 8 });

  // =============================
  // HANDLE CHANGE
  // =============================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =============================
  // REGISTER
  // =============================

  const handleRegister = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "https://smart-reading-companion-1.onrender.com/api/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await res.json();
      

      alert(data.message);

      if (res.ok) {
        setShowOTP(true);
      }
    } catch (err) {
      console.log(err);

      alert("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // VERIFY OTP
  // =============================

  const handleVerifyOTP = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "https://smart-reading-companion-1.onrender.com/api/auth/verify-otp",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },


          body: JSON.stringify({
            email: formData.email,
            otp: formData.otp,
          }),
        }
      );

      const data = await res.json();
      

      alert(data.message);

      if (res.ok) {
        setShowOTP(false);
        setIsLogin(true);
      }
    } catch (err) {
      console.log(err);

      alert("OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // LOGIN
  // =============================

  const handleLogin = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await res.json();

      console.log(data);
      //new thing
       if (!res.ok) {
      alert(data.message || "Login failed");
      return;
    }
    console.log("LOGIN RESPONSE:", data);
//close new thing

      if (data.token) {
        localStorage.setItem("token", data.token);
        

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        alert("Login successful");

        window.location.href = "/dashboard";
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);

      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // FORGOT PASSWORD
  // =============================

  const handleForgotPassword = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "https://smart-reading-companion-1.onrender.com/api/auth/forgot-password",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: formData.email,
          }),
        }
      );

      const data = await res.json();
      

      alert(data.message);

      if (res.ok) {
        setShowResetPassword(true);
      }
    } catch (err) {
      console.log(err);

      alert("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // RESET PASSWORD
  // =============================

  const handleResetPassword = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "https://smart-reading-companion-1.onrender.com/api/auth/reset-password",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: formData.email,
            otp: formData.otp,
            newPassword: formData.newPassword,
          }),
        }
      );

      const data = await res.json();
      

      alert(data.message);

      if (res.ok) {
        setShowForgotPassword(false);
        setShowResetPassword(false);
        setIsLogin(true);
      }
    } catch (err) {
      console.log(err);

      alert("Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`relative min-h-screen overflow-hidden flex items-center justify-center px-4 py-8 transition-all duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-gray-950 via-gray-900 to-black"
          : "bg-gradient-to-br from-amber-100 via-orange-200 to-yellow-100"
      }`}
    >

      {/* FLOATING BOOKS */}
      {floatingBooks.map((_, index) => (
        <motion.div
          key={index}
          initial={{ y: "110vh", rotate: -20, opacity: 0.2 }}
          animate={{
            y: "-20vh",
            rotate: 20,
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 12 + index * 2,
            repeat: Infinity,
            delay: index,
            ease: "linear",
          }}
          className={`absolute w-10 h-14 md:w-14 md:h-20 rounded-sm shadow-2xl ${
            darkMode
              ? "bg-gradient-to-b from-orange-500 to-red-700"
              : "bg-gradient-to-b from-red-700 to-red-900"
          }`}
          style={{
            left: `${index * 12}%`,
          }}
        >
          <div className="absolute left-1 top-0 h-full w-2 bg-yellow-100 rounded-l-sm"></div>

          <div className="absolute inset-2 border border-yellow-200 rounded-sm opacity-40"></div>
        </motion.div>
      ))}

      {/* MAIN CARD */}
      <div
        className={`relative z-10 w-full max-w-5xl backdrop-blur-2xl border rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row transition-all duration-500 ${
          darkMode
            ? "bg-white/5 border-white/10"
            : "bg-white/20 border-white/30"
        }`}
      >

        {/* LEFT SIDE */}
        <div
          className={`w-full md:w-1/2 flex flex-col items-center justify-center p-8 md:p-10 ${
            darkMode
              ? "bg-white/5 text-white"
              : "bg-black/20 text-white"
          }`}
        >

          <motion.h1
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-extrabold mb-4 text-center"
          >
            {showForgotPassword
              ? "Reset Password 🔐"
              : isLogin
              ? "Welcome Back 📚"
              : "Join The Reading Journey ✨"}
          </motion.h1>

          <p className="text-center opacity-80 max-w-sm text-sm md:text-base">
            {showForgotPassword
              ? "Securely reset your account password"
              : isLogin
              ? "Login to continue your smart reading journey"
              : "Create your account and explore your digital library"}
          </p>

          {!showForgotPassword && (
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="mt-8 px-6 py-3 border border-white rounded-full hover:bg-white hover:text-black transition duration-300"
            >
              {isLogin
                ? "Create Account"
                : "Login"}
            </button>
          )}

        </div>

        {/* RIGHT SIDE */}
        <div
          className={`w-full md:w-1/2 flex items-center justify-center p-6 md:p-10 transition-all duration-500 ${
            darkMode
              ? "bg-gray-900"
              : "bg-white"
          }`}
        >

          <motion.div
            key={isLogin ? "login" : "register"}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md"
          >

            <h2
              className={`text-3xl md:text-4xl font-bold mb-8 text-center ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              {showForgotPassword
                ? "Forgot Password"
                : showOTP
                ? "Verify OTP"
                : isLogin
                ? "Login"
                : "Register"}
            </h2>

            {/* REGISTER */}
            {!isLogin && !showOTP && !showForgotPassword && (
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                onChange={handleChange}
                className={`w-full p-4 mb-4 border rounded-2xl outline-none transition ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500"
                    : "bg-white border-gray-300 text-gray-800 focus:ring-2 focus:ring-orange-400"
                }`}
              />
            )}

            {/* EMAIL */}
            {!showOTP && (
              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                className={`w-full p-4 mb-4 border rounded-2xl outline-none transition ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500"
                    : "bg-white border-gray-300 text-gray-800 focus:ring-2 focus:ring-orange-400"
                }`}
              />
            )}

            {/* PASSWORD */}
            {!showOTP && !showResetPassword && (
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                className={`w-full p-4 mb-4 border rounded-2xl outline-none transition ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500"
                    : "bg-white border-gray-300 text-gray-800 focus:ring-2 focus:ring-orange-400"
                }`}
              />
            )}

            {/* OTP */}
            {(showOTP || showResetPassword) && (
              <input
                type="text"
                name="otp"
                placeholder="Enter OTP"
                onChange={handleChange}
                className={`w-full p-4 mb-4 border rounded-2xl outline-none transition ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500"
                    : "bg-white border-gray-300 text-gray-800 focus:ring-2 focus:ring-orange-400"
                }`}
              />
            )}

            {/* NEW PASSWORD */}
            {showResetPassword && (
              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                onChange={handleChange}
                className={`w-full p-4 mb-6 border rounded-2xl outline-none transition ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500"
                    : "bg-white border-gray-300 text-gray-800 focus:ring-2 focus:ring-orange-400"
                }`}
              />
            )}

            {/* LOGIN BUTTON */}
            {isLogin && !showForgotPassword && !showOTP && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white py-4 rounded-2xl shadow-lg hover:shadow-2xl transition font-semibold"
              >
                {loading ? "Please wait..." : "Login"}
              </motion.button>
            )}

            {/* REGISTER BUTTON */}
            {!isLogin && !showOTP && !showForgotPassword && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRegister}
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white py-4 rounded-2xl shadow-lg hover:shadow-2xl transition font-semibold"
              >
                {loading ? "Please wait..." : "Register"}
              </motion.button>
            )}

            {/* VERIFY OTP BUTTON */}
            {showOTP && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleVerifyOTP}
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white py-4 rounded-2xl shadow-lg hover:shadow-2xl transition font-semibold"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </motion.button>
            )}

            {/* SEND RESET OTP */}
            {showForgotPassword && !showResetPassword && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleForgotPassword}
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white py-4 rounded-2xl shadow-lg hover:shadow-2xl transition font-semibold"
              >
                {loading ? "Sending..." : "Send OTP"}
              </motion.button>
            )}

            {/* RESET PASSWORD */}
            {showResetPassword && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleResetPassword}
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white py-4 rounded-2xl shadow-lg hover:shadow-2xl transition font-semibold"
              >
                {loading ? "Updating..." : "Reset Password"}
              </motion.button>
            )}

            {/* FORGOT PASSWORD */}
            {isLogin && !showForgotPassword && !showOTP && (
              <button
                onClick={() => setShowForgotPassword(true)}
                className={`mt-4 hover:underline w-full text-center ${
                  darkMode
                    ? "text-orange-400"
                    : "text-orange-600"
                }`}
              >
                Forgot Password?
              </button>
            )}

            {/* BACK BUTTON */}
            {showForgotPassword && (
              <button
                onClick={() => {
                  setShowForgotPassword(false);
                  setShowResetPassword(false);
                }}
                className={`mt-4 hover:underline w-full text-center ${
                  darkMode
                    ? "text-gray-300"
                    : "text-gray-600"
                }`}
              >
                ← Back To Login
              </button>
            )}

          </motion.div>
        </div>
      </div>
    </div>
  );
}



