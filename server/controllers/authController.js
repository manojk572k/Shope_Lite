const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const crypto = require("crypto");

// helper
const signToken = (user) => {
  if (!JWT_SECRET) throw new Error("JWT_SECRET missing");
  return jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
};

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ status: "error", message: "All fields are required" });
    }

    const cleanEmail = String(email).trim().toLowerCase();

    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(409).json({ status: "error", message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
      username,
      email: cleanEmail,
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
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Error in user registration", err);
    return res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: "error", message: "All fields are required" });
    }

    const cleanEmail = String(email).trim().toLowerCase();

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(401).json({ status: "error", message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ status: "error", message: "Invalid credentials" });
    }

    const token = signToken(user);

    return res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        token,
        user: {
          userId: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (err) {
    console.error("Error in user login", err);
    return res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

exports.profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }

    return res.status(200).json({
      status: "success",
      message: "Profile fetched successfully",
      data: user,
    });
  } catch (err) {
    console.error("Error fetching user profile", err);
    return res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

/**
 * ✅ Update Username (Protected)
 * body: { username }
 */
exports.changeUsername = async (req, res) => {
  try {
    const { username } = req.body;
    const newUsername = String(username || "").trim();

    if (!newUsername) {
      return res.status(400).json({ status: "error", message: "Username is required" });
    }

    if (newUsername.length < 3 || newUsername.length > 20) {
      return res.status(400).json({ status: "error", message: "Username must be 3 to 20 characters" });
    }

    if (!/^[a-zA-Z0-9_]+$/.test(newUsername)) {
      return res.status(400).json({
        status: "error",
        message: "Username can contain only letters, numbers, and underscore",
      });
    }

    const taken = await User.findOne({
      username: new RegExp("^" + newUsername + "$", "i"),
      _id: { $ne: req.user.userId },
    });

    if (taken) {
      return res.status(409).json({ status: "error", message: "Username already taken" });
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { username: newUsername },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) return res.status(404).json({ status: "error", message: "User not found" });

    return res.status(200).json({
      status: "success",
      message: "Username updated successfully",
      data: user,
    });
  } catch (err) {
    console.error("Error changing username", err);
    return res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

/**
 * ✅ Update Email (Protected)
 * body: { email }
 */
exports.changeEmail = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();

    // 1) validate
    if (!email || !email.includes("@")) {
      return res.status(400).json({
        status: "error",
        message: "Valid email required",
      });
    }

    // 2) check duplicate email
    const exists = await User.findOne({ email });
    if (exists && exists._id.toString() !== req.user.userId) {
      return res.status(409).json({
        status: "error",
        message: "Email already in use",
      });
    }

    // 3) update user
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { email },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Email updated successfully",
      data: user,
    });
  } catch (err) {
    console.error("Change email error", err);
    return res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};

/**
 * ✅ Update Password (Protected, secure)
 * body: { currentPassword, newPassword }
 */
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ status: "error", message: "Both passwords required" });
    }

    if (String(newPassword).length < 6) {
      return res.status(400).json({ status: "error", message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ status: "error", message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ status: "error", message: "Current password incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({ status: "success", message: "Password updated successfully" });
  } catch (err) {
    console.error("Change password error", err);
    return res.status(500).json({ status: "error", message: "Server error" });
  }
};

exports.debugUser = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ status: "error", message: "email query required" });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(404).json({ status: "error", message: "User NOT found" });

    return res.status(200).json({
      status: "success",
      message: "User found",
      data: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        hasPassword: !!user.password,
        passwordHashPrefix: String(user.password).slice(0, 15) // just to confirm hashed exists
      }
    });
  } catch (err) {
    console.error("debugUser error", err);
    return res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

exports.debugResetPasswordUnsafe = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ status: "error", message: "email and newPassword required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(404).json({ status: "error", message: "User not found" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({ status: "success", message: "Password reset done (debug)" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: "error", message: "Server error" });
  }
};


exports.debugUser = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ status: "error", message: "email query required" });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(404).json({ status: "error", message: "User NOT found" });

    return res.status(200).json({
      status: "success",
      message: "User found",
      data: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("debugUser error", err);
    return res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    if (!email || !email.includes("@")) {
      return res.status(400).json({ status: "error", message: "Valid email required" });
    }

    const user = await User.findOne({ email });
    // ✅ Security: always return success (don’t reveal if email exists)
    if (!user) {
      return res.status(200).json({
        status: "success",
        message: "If that email exists, a reset link has been sent."
      });
    }

    // 1) Create raw token
    const rawToken = crypto.randomBytes(32).toString("hex");

    // 2) Hash token before storing in DB
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

    // 3) Set expiry (15 minutes)
    user.resetPasswordTokenHash = tokenHash;
    user.resetPasswordExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    // 4) Build reset link (frontend route)
    // Change to your deployed frontend later
    const resetLink = `http://localhost:5173/reset-password/${rawToken}`;

    // ✅ For now: return link in response (for testing)
    // Later: email it using Nodemailer
    return res.status(200).json({
      status: "success",
      message: "Reset link generated (demo mode).",
      data: { resetLink }
    });
  } catch (err) {
    console.error("Forgot password error", err);
    return res.status(500).json({ status: "error", message: "Server error" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const token = String(req.params.token || "").trim();
    const newPassword = String(req.body.newPassword || "");

    if (!token) {
      return res.status(400).json({ status: "error", message: "Reset token required" });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        status: "error",
        message: "New password must be at least 6 characters"
      });
    }

    // 1) Hash incoming token to compare with DB hash
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    // 2) Find user by valid token + not expired
    const user = await User.findOne({
      resetPasswordTokenHash: tokenHash,
      resetPasswordExpiresAt: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "Token invalid or expired"
      });
    }

    // 3) Set new password
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;

    // 4) Clear reset fields
    user.resetPasswordTokenHash = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    return res.status(200).json({
      status: "success",
      message: "Password reset successful. Please login with your new password."
    });
  } catch (err) {
    console.error("Reset password error", err);
    return res.status(500).json({ status: "error", message: "Server error" });
  }
};
