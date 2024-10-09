// backend/routes/auth.js
const express = require("express");
const { register, login } = require("../controllers/authController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// Public route
router.post("/login", login);

// Protected route - only Admin can register users
router.post("/register", protect, authorize("Admin"), register);

module.exports = router;
