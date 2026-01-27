const express = require("express");
const router = express.Router();

const { register ,login,profile} = require("../controllers/authController");
const {protect, requireRole} = require("../middleware/authMiddlewear");

// ✅ MUST be public (no middleware here)
router.post("/register", register);
router.post("/login", login);

router.get("/profile", protect, profile); 

router.get("/admin", protect, requireRole("admin"), (req, res) => {
  return res.status(200).send({ status: "success", message: "Welcome, admin!",data:{userId:req.user.userId,role:req.user.role} });
}
);
router.get("/staff", protect, requireRole("admin", "user"), (req, res) => {
  return res.status(200).json({
    status: "success",
    message: "Welcome, staff!",
    data: { userId: req.user.userId, role: req.user.role }
  });
});


module.exports = router;
