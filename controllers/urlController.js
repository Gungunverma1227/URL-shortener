const shortid = require("shortid");
const Url = require("../models/Url");

exports.shortenUrl = async (req, res) => {
  const { longUrl } = req.body;

  if (!longUrl) {
    return res.status(400).json({ message: "Long URL is required" });
  }

  const shortCode = shortid.generate();

  try {
    const url = await Url.create({
      shortCode,
      longUrl,
      owner: req.user._id,
    });

    // ✅ For browser forms: redirect to dashboard
    res.redirect("/api/urls/dashboard");

    // ❌ For API: uncomment if needed
    // res.status(201).json({
    //   shortUrl: `${req.protocol}://${req.get("host")}/${shortCode}`,
    //   url,
    // });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.redirectToLongUrl = async (req, res) => {
  const { shortCode } = req.params;

  try {
    const url = await Url.findOne({ shortCode });
    if (!url) return res.status(404).send("Short URL not found");

    url.clickCount++;
    await url.save();

    res.redirect(url.longUrl);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

exports.getUserUrls = async (req, res) => {
  try {
    const urls = await Url.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(urls);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
