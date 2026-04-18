const shortid = require("shortid");
const Url = require("../models/Url");

exports.uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const shortCode = shortid.generate();
  const filePath = `/uploads/${req.file.filename}`;
  const fullPath = `${req.protocol}://${req.get("host")}${filePath}`;

  try {
    const newUrl = new Url({
      shortCode,
      longUrl: fullPath,
      owner: req.user._id,
    });

    await newUrl.save();
    res.redirect("/api/urls/dashboard");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
