// backend/routes/admin.js
const express = require("express");
const {
  createTrainer,
  updateTrainer,
  deleteTrainer,
  createClassSchedule,
  assignTrainer,
} = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// Protect all admin routes
router.use(protect);
router.use(authorize("Admin"));

// Trainer CRUD
router.post("/trainers", createTrainer);
router.put("/trainers/:trainerId", updateTrainer);
router.delete("/trainers/:trainerId", deleteTrainer);

// Class Schedule
router.post("/schedules", createClassSchedule);
router.put("/schedules/assign", assignTrainer);

// Additional admin routes can be added here

module.exports = router;
