// backend/routes/trainee.js
const express = require("express");
const {
  getAvailableSchedules,
  bookClass,
  cancelBooking,
  getMyBookings,
} = require("../controllers/traineeController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// Protect and authorize
router.use(protect);
router.use(authorize("Trainee"));

// Get available class schedules
router.get("/schedules", getAvailableSchedules);

// Book a class
router.post("/book", bookClass);

// Cancel a booking
router.delete("/bookings/:bookingId", cancelBooking);

// Get my bookings
router.get("/bookings", getMyBookings);

module.exports = router;
