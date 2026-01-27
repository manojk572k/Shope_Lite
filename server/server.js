require("dotenv").config();
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5050;
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");

const app = express();
// middleware
app.use(cors());
app.use(express.json());

// request logger (helps you see what's coming in)
app.use((req, res, next) => {
  console.log("REQ:", req.method, req.url);
  next();
});

console.log("RUNNING FILE:", __filename);
console.log("CWD:", process.cwd());

// routes
app.get("/", (req, res) => {
  return res.status(200).json({
    status: "Ok",
    message: "Shope_Lite Backend Running",
    data: {}
  });
});

app.get("/health", (req, res) => {
  return res.status(200).json({ status: "success", data: { ok: true } });
});

app.use((req, res, next) => {
  if (req.url.includes("%0A") || req.url.includes("%0D")) {
    return res.status(400).json({ message: "Bad request URL" });
  }
  next();
});


// ✅ register/login routes must be public (no auth middleware here)
app.use("/api/auth", authRoutes);

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
}

startServer();

