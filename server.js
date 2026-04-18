require("dotenv").config();
console.log("MONGO URI CHECK:", process.env.MONGO_URI);

const fs = require("fs");
const path = require("path"); // ✅ only declared once
const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const passport = require("passport");
const session = require("express-session");
const { redirectToLongUrl } = require("./controllers/urlController");

require("./config/passport");
connectDB();

// Ensure uploads folder exists before server starts
const uploadDir = path.join(__dirname, "public", "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", require("./routes/authRoutes"));
app.use("/api/urls", require("./routes/urlRoutes"));
app.use("/api/files", require("./routes/fileRoutes"));

app.get("/", (req, res) => { res.render("home.ejs"); });
app.get("/login", (req, res) => { res.render("login.ejs"); });
app.get("/register", (req, res) => { res.render("register.ejs"); });
app.get("/:shortCode", redirectToLongUrl);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
