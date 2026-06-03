import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import UploadBook from "./pages/UploadBook";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Progress from "./pages/Progress";
import Library from "./pages/Library";
import AIAssistant from "./pages/AIAssistant";
import Profile from "./pages/Profile";
import Reader from "./pages/Reader";
import BookDetails from "./pages/BookDetails";


function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* AUTH */}
        <Route path="/" element={<AuthPage />} />

        {/* DASHBOARD */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* BOOKS */}
        <Route path="/books" element={<Books />} />

        {/* PROGRESS */}
        <Route path="/progress" element={<Progress />} />

        {/* LIBRARY */}
        <Route path="/library" element={<Library />} />

        {/* AI ASSISTANT */}
        <Route path="/ai" element={<AIAssistant />} />

        {/* PROFILE */}
        <Route path="/profile" element={<Profile />} />

        <Route path="/profile/:id" element={<Profile />} />

        {/* UPLOAD BOOK */}
        <Route path="/upload" element={<UploadBook />} />

        {/*READER */}
        <Route path="/read" element={<Reader />} />

        {/*BOOK DETAILS*/}
        <Route path="/book/:id" element={<BookDetails />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;