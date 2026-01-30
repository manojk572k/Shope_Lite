const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const { protect, requireRole } = require("../middleware/authMiddlewear");

// Public
router.post("/register", authController.register);
router.post("/login", authController.login);

// Protected
router.get("/profile", protect, authController.profile);

// ✅ Updates (Protected)
router.patch("/username", protect, authController.changeUsername);
router.patch("/email", protect, authController.changeEmail);
router.patch("/password", protect, authController.changePassword);

router.get("/debug-user", authController.debugUser);
router.post("/debug-reset-password", authController.debugResetPasswordUnsafe);

router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);
// router.patch("/username", protect, authController.ChangeUserName) 


// Role demos
router.get("/admin", protect, requireRole("admin"), (req, res) => {
  return res.status(200).json({
    status: "success",
    message: "Welcome, admin!",
    data: { userId: req.user.userId, role: req.user.role },
  });
});

router.get("/staff", protect, requireRole("admin", "user"), (req, res) => {
  return res.status(200).json({
    status: "success",
    message: "Welcome, staff!",
    data: { userId: req.user.userId, role: req.user.role },
  });
});

module.exports = router;
