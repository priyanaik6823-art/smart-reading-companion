import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import axios from "axios";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const Reader = () => {
  const location = useLocation();

  const pdfUrl = location.state?.pdfUrl;
  const bookId = location.state?.bookId;
  const totalPages = location.state?.totalPages;

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  // 🔥 DEBUG (keep for now)
  console.log("USER:", user);
  console.log("USER ID:", userId);
  console.log("BOOK ID:", bookId);

  // ================= SAFETY GUARD =================
  if (!pdfUrl || !bookId || !userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121212] text-white">
        <p>Loading book... Please open from Dashboard.</p>
      </div>
    );
  }

  // ================= GET PROGRESS =================
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/progress/user/${userId}/book/${bookId}`
        );

        console.log("PROGRESS RESPONSE:", res.data);

        if (res.data?.currentPage) {
          setPageNumber(res.data.currentPage);
        }
      } catch (err) {
        console.log(
          "Fetch progress error:",
          err.response?.data || err.message
        );
      }
    };

    fetchProgress();
  }, [userId, bookId]);

  // ================= SAVE PROGRESS =================
  const saveProgress = async (page) => {
    try {
      await axios.post("http://localhost:5000/api/progress/save", {
        userId,
        bookId,
        currentPage: page,
        totalPages,
      });
    } catch (err) {
      console.log("Save progress error:", err.message);
    }
  };

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  // ================= NAVIGATION =================
  const handleNext = () => {
    if (pageNumber >= numPages) return;

    const next = pageNumber + 1;
    setPageNumber(next);
    saveProgress(next);
  };

  const handlePrevious = () => {
    if (pageNumber <= 1) return;

    const prev = pageNumber - 1;
    setPageNumber(prev);
    saveProgress(prev);
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col items-center px-3 py-4">

      <h1 className="text-2xl font-bold mb-3">📖 Reading Mode</h1>

      <p className="text-gray-400 mb-4">
        Page {pageNumber} of {numPages || "--"}
      </p>

      {/* PDF VIEWER */}
      <div className="bg-white rounded-xl p-2">
        <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} width={700} />
        </Document>
      </div>

      {/* CONTROLS */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={handlePrevious}
          disabled={pageNumber <= 1}
          className="bg-orange-500 px-4 py-2 rounded-xl disabled:opacity-40"
        >
          Previous
        </button>

        <button
          onClick={handleNext}
          disabled={pageNumber >= numPages}
          className="bg-orange-500 px-4 py-2 rounded-xl disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Reader;