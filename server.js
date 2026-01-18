require("dotenv").config();
console.log("MONGO URI CHECK:", process.env.MONGO_URI);

const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const passport = require("passport");
const session = require("express-session");
const { redirectToLongUrl } = require("./controllers/urlController");


require("./config/passport");
connectDB();

const app = express();
app.use(express.json()); // as i need to parse JSON requests
app.use(express.urlencoded({ extended: false })); 
app.use(cookieParser()); // for parsing cookies
app.use(express.static("public")); // for CSS, JS, uploads, etc.

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(session({secret: process.env.SESSION_SECRET,resave: false,saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", require("./routes/authRoutes"));
app.use("/api/urls", require("./routes/urlRoutes"));
app.use("/api/files", require("./routes/fileRoutes"));

app.get("/", (req, res) => { res.render("home.ejs"); }); // Home route to render home.ejs
app.get("/login", (req, res) => { res.render("login.ejs"); }); // Login route to render login.ejs
app.get("/register", (req, res) => { res.render("register.ejs"); }); // Register route to render register.ejs
app.get("/:shortCode", redirectToLongUrl);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));