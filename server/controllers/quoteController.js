exports.createQuote = async (req, res) => {
  try {
    const { text, author } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Quote text is required",
      });
    }

    const quote = {
      text,
      author: author || "Unknown",
      userId: req.user?._id || null,
      createdAt: new Date(),
    };

    res.status(201).json({
      success: true,
      message: "Quote created successfully",
      quote,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};