const express = require("express");
const router = express.Router();
const { uploadFile } = require("../controllers/fileController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

router.post("/upload", protect, upload.single("file"), uploadFile);

module.exports = router;
