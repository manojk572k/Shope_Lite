require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5050;

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");

const app = express();

// ✅ middleware
app.use(express.json());

// ✅ single cors config (only once)
app.use(
  cors({
    origin: ["http://localhost:5173", "https://shope-lite.onrender.com"],
    credentials: true,
  })
);

// request logger
app.use((req, res, next) => {
  console.log("REQ:", req.method, req.url);
  next();
});

// basic routes
app.get("/", (req, res) => {
  return res.status(200).json({
    status: "Ok",
    message: "Shope_Lite Backend Running",
    data: {},
  });
});

app.get("/health", (req, res) => {
  return res.status(200).json({ status: "success", data: { ok: true } });
});

// sanitize bad URL
app.use((req, res, next) => {
  if (req.url.includes("%0A") || req.url.includes("%0D")) {
    return res.status(400).json({ status: "error", message: "Bad request URL" });
  }
  next();
});

// routes
app.use("/api/auth", authRoutes);

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    console.log("DB:", mongoose.connection.name);
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
}
startServer();
