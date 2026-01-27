const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        status: "error",
        message: "All fields are required"
      });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({
        status: "error",
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role === "admin" ? "admin" : "user"
    });

    return res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: {
        userId: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error("Error in user registration", err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "All fields are required"
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: "error",
        message: "Invalid credentials"
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing in environment variables");
      return res.status(500).json({
        status: "error",
        message: "Server misconfiguration"
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        token,
        user: {
          userId: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (err) {
    console.error("Error in user login", err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  }
};

exports.profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found"
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Profile fetched successfully",
      data: user
    });
  } catch (err) {
    console.error("Error fetching user profile", err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  }
};
