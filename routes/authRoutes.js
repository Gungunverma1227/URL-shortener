const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getMe } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const passport = require("passport");

// Google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.cookie("token", token);
    res.redirect("/api/urls/dashboard");
}
);

// router.get("/google",passport.authenticate("google", {scope: ["profile", "email"] }));
// // OAuth callback
// router.get("/google/callback",
//   passport.authenticate("google", { failureRedirect: "/" }),
//   (req, res) => {
//     const jwt = require("jsonwebtoken");
//     const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       maxAge: 7 * 24 * 60 * 60 * 1000
//     });

//     res.redirect("/api/urls/dashboard");
//   }
// );

// GitHub
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
router.get("/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.cookie("token", token);
    res.redirect("/api/urls/dashboard");
  }
);

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  req.logout(() => {
    res.redirect("/");
  });
});


router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe); // protected user profile

module.exports = router;