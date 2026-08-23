const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getMe, getAllUsers } = require("../controllers/authController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe); // protected: needs valid token
router.get("/users", protect, adminOnly, getAllUsers); // admin: view all users

module.exports = router;
