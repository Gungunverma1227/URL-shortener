require("dotenv").config();
const mongoose = require("mongoose");

console.log("URI:", process.env.MONGO_URI ? "FOUND" : "NOT FOUND");

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Atlas Connected");
    process.exit(0);
  })
  .catch(err => {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1);
  });
