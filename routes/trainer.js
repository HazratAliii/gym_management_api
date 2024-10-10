const express = require("express");
const { getAssignedSchedules } = require("../controllers/trainerController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// Protect and authorize
router.use(protect);
router.use(authorize("Trainer"));

// Get assigned schedules
router.get("/schedules", getAssignedSchedules);

module.exports = router;
