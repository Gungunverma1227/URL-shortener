const express = require("express");
const router = express.Router();
const { shortenUrl, getUserUrls } = require("../controllers/urlController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

//  Shorten a new long URL
router.post("/shorten", protect, shortenUrl);

//  Get all URLs of the logged-in user (API route)
router.get("/my-urls", protect, getUserUrls);

//  Delete a short URL by ID (from dashboard)
router.post("/delete/:id", protect, async (req, res) => {
  await require("../models/Url").deleteOne({ _id: req.params.id, owner: req.user._id });
  res.redirect("/api/urls/dashboard");
});

//  Upload a file and get a short URL
router.post("/upload", protect, upload.single("file"), async (req, res) => {
  const Url = require("../models/Url");
  const shortid = require("shortid");

  const shortCode = shortid.generate();
  const filePath = `/uploads/${req.file.filename}`;
  const fullPath = `${req.protocol}://${req.get("host")}${filePath}`;

  const newUrl = new Url({
    shortCode,
    longUrl: fullPath,
    owner: req.user._id,
  });

  await newUrl.save();
  res.redirect("/api/urls/dashboard");
});

// Dashboard UI: Show all user-specific links
router.get("/dashboard", protect, async (req, res) => {
  const urls = await require("../models/Url").find({ owner: req.user._id }).sort({ createdAt: -1 });
  res.render("dashboard", {
    user: req.user,
    urls,
    requestHost: `${req.protocol}://${req.get("host")}`,
  });
});

module.exports = router;
