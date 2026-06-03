
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import axios from "axios";

import {
  Menu,
  X,
  Moon,
  Sun,
  LogOut,
  Settings,
  BookOpen,
  Quote,
  Bot,
  User,
  BarChart3,
  Library,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  const [isFollowing, setIsFollowing] = useState(false);
  const [profileUser, setProfileUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [quotes, setQuotes] = useState([]);

  // QUOTE DATA
  const [quoteData, setQuoteData] = useState({
    text: "",
    author: "",
    book: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");

  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);

  // QUOTE FORM
  const [showQuoteForm, setShowQuoteForm] = useState(false);

  const { id } = useParams();

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = storedUser?._id;

  const isMyProfile =
    profileUser &&
    currentUserId &&
    profileUser._id.toString() === currentUserId;

  const { darkMode, toggleTheme } = useTheme();

  const [showMenu, setShowMenu] = useState(false);
  const [activeTab, setActiveTab] = useState("quotes");

  const totalPosts = books.length + quotes.length;

  // FOLLOW USER
  const handleFollow = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/follow/follow/${profileUser?._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      await fetchProfile();
    } catch (err) {
      console.log(err);
    }
  };

  // UNFOLLOW USER
  const handleUnfollow = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/follow/unfollow/${profileUser?._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      await fetchProfile();
    } catch (err) {
      console.log(err);
    }
  };

  // EDIT PROFILE
  const handleEditProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        "http://localhost:5000/api/user/edit",
        {
          name: editName,
          bio: editBio,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProfileUser(res.data);
      setEditMode(false);
    } catch (err) {
      console.log(err);
    }
  };

  // PROFILE PIC UPLOAD
  const handleProfilePicUpload = async (e) => {
    try {
      const file = e.target.files[0];

      if (!file) return;

      const formData = new FormData();
      formData.append("profilePic", file);

      const token = localStorage.getItem("token");

      const res = await axios.put(
        "http://localhost:5000/api/user/upload-profile-pic",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedUser = {
        ...profileUser,
        profilePic: res.data.profilePic,
      };

      setProfileUser(updatedUser);

      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      console.log(err);
    }
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // POST QUOTE
  const handlePostQuote = () => {
    if (!quoteData.text.trim()) return;

    const newQuote = {
      id: Date.now(),
      text: quoteData.text,
      author: quoteData.author,
      book: quoteData.book,
    };

    setQuotes((prev) => [newQuote, ...prev]);

    setQuoteData({
      text: "",
      author: "",
      book: "",
    });

    setShowQuoteForm(false);
  };

  // CHECK FOLLOW STATUS
  useEffect(() => {
    if (profileUser?.followers && currentUserId) {
      setIsFollowing(
        profileUser.followers.some(
          (follower) =>
            follower._id?.toString() === currentUserId.toString()
        )
      );
    }
  }, [profileUser, currentUserId]);

  // PREFILL EDIT DATA
  useEffect(() => {
    if (profileUser) {
      setEditName(profileUser.name || "");
      setEditBio(profileUser.bio || "");
    }
  }, [profileUser]);

  // FETCH PROFILE
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const profileId =
        id && id !== "undefined"
          ? id
          : currentUserId;

      const url = `http://localhost:5000/api/user/${profileId}`;

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfileUser(res.data);

      setIsFollowing(
        res.data.followers?.some(
          (follower) =>
            follower._id?.toString() === currentUserId?.toString()
        )
      );

      setBooks(res.data.books || []);

      setFollowersList(res.data.followers || []);
      setFollowingList(res.data.following || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id, currentUserId]);

  return (
    <div
      className={`min-h-screen relative overflow-hidden transition duration-300 pb-24 ${
        darkMode
          ? "bg-gradient-to-br from-[#1a1a1a] via-[#111111] to-black text-white"
          : "bg-gradient-to-br from-amber-100 via-orange-200 to-yellow-100 text-gray-900"
      }`}
    >
      {/* GLOW */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-orange-300 blur-3xl opacity-20 rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-pink-300 blur-3xl opacity-20 rounded-full"></div>

      {/* TOP BAR */}
      <div
        className={`sticky top-0 z-50 px-5 py-4 flex items-center justify-between backdrop-blur-xl border-b ${
          darkMode
            ? "bg-black/30 border-gray-800"
            : "bg-white/20 border-white/30"
        }`}
      >
        <h1 className="text-2xl font-bold">
          Books are a uniquely portable magic
        </h1>

        <button onClick={() => setShowMenu(true)}>
          <Menu size={28} />
        </button>
      </div>

      {/* SIDE MENU */}
      <AnimatePresence>
        {showMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMenu(false)}
              className="fixed inset-0 bg-black/40 z-40"
            />

            <motion.div
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              transition={{ type: "spring", damping: 22 }}
              className={`fixed top-0 right-0 h-full w-72 z-50 shadow-2xl p-6 backdrop-blur-2xl ${
                darkMode ? "bg-[#111]/95" : "bg-white/80"
              }`}
            >
              <div className="flex justify-end mb-8">
                <button onClick={() => setShowMenu(false)}>
                  <X size={26} />
                </button>
              </div>

              <div className="space-y-6">
                <button className="flex items-center gap-4 text-lg">
                  <Settings size={22} />
                  Edit Profile
                </button>

                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-4 text-lg"
                >
                  {darkMode ? (
                    <>
                      <Sun size={22} /> Light Mode
                    </>
                  ) : (
                    <>
                      <Moon size={22} /> Dark Mode
                    </>
                  )}
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-4 text-lg text-red-500"
                >
                  <LogOut size={22} />
                  Logout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MAIN */}
      <div className="relative z-10 px-4 md:px-6 py-5 max-w-5xl mx-auto">

        {/* PROFILE SECTION */}
        <div className="flex items-center gap-6 mt-3">

          <div className="flex flex-col items-center">
            <img
              src={
                profileUser?.profilePic
                  ? `http://localhost:5000/${profileUser.profilePic}`
                  : "https://i.pravatar.cc/300"
              }
              alt="profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-xl"
            />

            {isMyProfile && (
              <label
                className={`mt-3 px-4 py-2 rounded-xl cursor-pointer text-sm font-medium ${
                  darkMode
                    ? "bg-white/10 text-white"
                    : "bg-black/10 text-gray-800"
                }`}
              >
                Edit Profile Picture

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="flex flex-1 justify-around">

            <div className="text-center">
              <h2 className="font-bold text-2xl">
                {totalPosts}
              </h2>

              <p className="text-sm opacity-70">
                posts
              </p>
            </div>

            <div
              onClick={() => setShowFollowers(true)}
              className="text-center cursor-pointer"
            >
              <h2 className="font-bold text-2xl">
                {profileUser?.followers?.length || 0}
              </h2>

              <p className="text-sm opacity-70">
                followers
              </p>
            </div>

            <div
              onClick={() => setShowFollowing(true)}
              className="text-center cursor-pointer"
            >
              <h2 className="font-bold text-2xl">
                {profileUser?.following?.length || 0}
              </h2>

              <p className="text-sm opacity-70">
                following
              </p>
            </div>
          </div>
        </div>

        {/* BIO */}
        <div className="mt-5">
          <h2 className="font-bold text-xl">
            {profileUser?.username || profileUser?.name}
          </h2>

          <p className="mt-2 opacity-80">
            {profileUser?.bio}
          </p>
        </div>

        {/* FOLLOW BUTTON */}
        {!isMyProfile && profileUser && (
          <button
            onClick={isFollowing ? handleUnfollow : handleFollow}
            className={`px-4 py-2 rounded-lg mt-5 ${
              isFollowing ? "bg-red-500" : "bg-blue-500"
            }`}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        )}

        {/* EDIT BUTTON */}
        {isMyProfile && (
          <button
            onClick={() => setEditMode(true)}
            className="w-full py-3 mt-5 rounded-2xl font-medium bg-white/20"
          >
            Edit Profile
          </button>
        )}

        {/* TABS */}
        <div className="flex justify-around mt-8 rounded-2xl overflow-hidden bg-white/10">
          <button
            onClick={() => setActiveTab("quotes")}
            className="flex-1 py-4"
          >
            <Quote className="mx-auto" />
          </button>

          <button
            onClick={() => setActiveTab("books")}
            className="flex-1 py-4"
          >
            <BookOpen className="mx-auto" />
          </button>
        </div>

        {/* QUOTES */}
        <div className="mt-6">
          {activeTab === "quotes" && (
            <div
              className={`rounded-3xl p-4 min-h-[300px] ${
                darkMode ? "bg-white/10" : "bg-white/40"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Quote size={20} />
                  Quotes
                </h2>

                <button
                  onClick={() => setShowQuoteForm(!showQuoteForm)}
                  className="px-4 py-2 rounded-xl bg-orange-500 text-white text-sm"
                >
                  Post Quote
                </button>
              </div>

              {/* QUOTE FORM is my profile added  */}
              {isMyProfile && showQuoteForm && (
                <div
                  className={`p-4 rounded-2xl mb-5 space-y-3 ${
                    darkMode ? "bg-black/20" : "bg-white/60"
                  }`}
                >
                  <textarea
                    placeholder="Write your quote..."
                    value={quoteData.text}
                    onChange={(e) =>
                      setQuoteData({
                        ...quoteData,
                        text: e.target.value,
                      })
                    }
                    rows={4}
                    className={`w-full p-3 rounded-xl outline-none resize-none ${
                      darkMode
                        ? "bg-white/10 text-white"
                        : "bg-white text-black"
                    }`}
                  />

                  <input
                    type="text"
                    placeholder="Author (optional)"
                    value={quoteData.author}
                    onChange={(e) =>
                      setQuoteData({
                        ...quoteData,
                        author: e.target.value,
                      })
                    }
                    className={`w-full p-3 rounded-xl outline-none ${
                      darkMode
                        ? "bg-white/10 text-white"
                        : "bg-white text-black"
                    }`}
                  />

                  <input
                    type="text"
                    placeholder="Book (optional)"
                    value={quoteData.book}
                    onChange={(e) =>
                      setQuoteData({
                        ...quoteData,
                        book: e.target.value,
                      })
                    }
                    className={`w-full p-3 rounded-xl outline-none ${
                      darkMode
                        ? "bg-white/10 text-white"
                        : "bg-white text-black"
                    }`}
                  />

                  {/* <button
  onClick={() => setShowQuoteForm(!showQuoteForm)}
  className="px-4 py-2 rounded-xl bg-orange-500 text-white text-sm"
>
  Post Quote
</button> */}
{isMyProfile && (
  <button
    onClick={() => setShowQuoteForm(!showQuoteForm)}
    className="px-4 py-2 rounded-xl bg-orange-500 text-white text-sm"
  >
    Post Quote
  </button>
)}
                </div>
              )}

              {quotes.length === 0 ? (
                <p className="text-center opacity-70 mt-10">
                  No quotes posted yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {quotes.map((quote) => (
                    <div
                      key={quote.id}
                      className={`p-4 rounded-2xl ${
                        darkMode
                          ? "bg-black/20"
                          : "bg-white/60"
                      }`}
                    >
                      <p className="italic text-lg">
                        “{quote.text}”
                      </p>

                      {(quote.author || quote.book) && (
                        <div className="mt-3 text-sm opacity-70">
                          {quote.author && (
                            <p>— {quote.author}</p>
                          )}

                          {quote.book && (
                            <p>{quote.book}</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* BOOKS */}
          {activeTab === "books" && (
            <div className="grid grid-cols-2 gap-4 mt-5">
              {books.map((book, i) => (
                <div
                  key={book._id || i}
                  onClick={() => navigate(`/book/${book._id}`)}
                  className={`cursor-pointer rounded-2xl overflow-hidden ${
                    darkMode
                      ? "bg-white/10"
                      : "bg-white/40"
                  }`}
                >
                  <img
                    src={`http://localhost:5000${book.coverImage}`}
                    alt={book.title}
                    className="w-full h-60 object-cover"
                  />

                  <div className="p-3">
                    <h2 className="font-bold line-clamp-1">
                      {book.title}
                    </h2>

                    <p className="text-sm opacity-70">
                      {book.author}
                    </p>

                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/profile/${book.uploadedBy}`);
                      }}
                      className="flex items-center gap-2 mt-3 cursor-pointer"
                    >
                      <img
                        src={
                          profileUser?.profilePic
                            ? `http://localhost:5000/${profileUser.profilePic}`
                            : "https://i.pravatar.cc/100"
                        }
                        alt="user"
                        className="w-8 h-8 rounded-full object-cover"
                      />

                      <p className="text-sm hover:underline">
                        {profileUser?.name}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* EDIT MODAL */}
      {editMode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className={`p-6 rounded-2xl w-[90%] max-w-md ${
              darkMode ? "bg-[#1a1a1a]" : "bg-white"
            }`}
          >
            <h2 className="text-2xl font-bold mb-4">
              Edit Profile
            </h2>

            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Name"
              className="w-full p-3 rounded-xl mb-4 text-black"
            />

            <textarea
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              placeholder="Bio"
              className="w-full p-3 rounded-xl mb-4 text-black"
            />

            <div className="flex gap-3">
              <button
                onClick={handleEditProfile}
                className="flex-1 bg-blue-500 py-3 rounded-xl"
              >
                Save
              </button>

              <button
                onClick={() => setEditMode(false)}
                className="flex-1 bg-gray-500 py-3 rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOLLOWERS MODAL */}
      {showFollowers && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div
            className={`w-[90%] max-w-md p-5 rounded-2xl max-h-[70vh] overflow-y-auto ${
              darkMode ? "bg-[#1a1a1a]" : "bg-white"
            }`}
          >
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold">
                Followers
              </h2>

              <button onClick={() => setShowFollowers(false)}>
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {followersList.map((user) => (
                <div
                  key={user._id}
                  onClick={() => {
                    navigate(`/profile/${user._id}`);
                    setShowFollowers(false);
                  }}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  {user?.profilePic ? (
                    <img
                      src={`http://localhost:5000/${user.profilePic}`}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
                      {user?.name?.charAt(0)}
                    </div>
                  )}

                  <div>
                    <h3 className="font-bold">
                      {user.name}
                    </h3>

                    <p className="text-sm opacity-70">
                      {user.email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FOLLOWING MODAL */}
      {showFollowing && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div
            className={`w-[90%] max-w-md p-5 rounded-2xl max-h-[70vh] overflow-y-auto ${
              darkMode ? "bg-[#1a1a1a]" : "bg-white"
            }`}
          >
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold">
                Following
              </h2>

              <button onClick={() => setShowFollowing(false)}>
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {followingList.map((user) => (
                <div
                  key={user._id}
                  onClick={() => {
                    navigate(`/profile/${user._id}`);
                    setShowFollowing(false);
                  }}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  {user?.profilePic ? (
                    <img
                      src={`http://localhost:5000/${user.profilePic}`}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
                      {user?.name?.charAt(0)}
                    </div>
                  )}

                  <div>
                    <h3 className="font-bold">
                      {user.name}
                    </h3>

                    <p className="text-sm opacity-70">
                      {user.email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM NAVBAR */}
      <div
        className={`fixed bottom-0 left-0 w-full border-t backdrop-blur-xl z-50 flex justify-around items-center py-3 ${
          darkMode
            ? "bg-black/40 border-gray-800"
            : "bg-white/30 border-white/40"
        }`}
      >
        <button
          onClick={() => navigate("/dashboard")}
          className="flex flex-col items-center"
        >
          <BarChart3 size={24} />
          <span className="text-xs mt-1">Dashboard</span>
        </button>

        <button
          onClick={() => navigate("/books")}
          className="flex flex-col items-center"
        >
          <BookOpen size={24} />
          <span className="text-xs mt-1">Books</span>
        </button>

        <button
          onClick={() => navigate("/library")}
          className="flex flex-col items-center"
        >
          <Library size={24} />
          <span className="text-xs mt-1">Library</span>
        </button>

        <button
          onClick={() => navigate("/ai")}
          className="flex flex-col items-center"
        >
          <Bot size={24} />
          <span className="text-xs mt-1">AI</span>
        </button>

        <button
          onClick={() => navigate(`/profile/${currentUserId}`)}
          className="flex flex-col items-center"
        >
          <User size={24} />
          <span className="text-xs mt-1">Profile</span>
        </button>
      </div>
    </div>
  );
};

export default Profile;