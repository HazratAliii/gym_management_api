// backend/controllers/traineeController.js
const ClassSchedule = require("../models/ClassSchedule");
const Booking = require("../models/Booking");

// @desc    Get all available class schedules
exports.getAvailableSchedules = async (req, res, next) => {
  try {
    const schedules = await ClassSchedule.find({
      date: { $gte: new Date() },
      trainees: { $size: { $lt: 10 } },
    }).populate("trainer", "user name expertise");

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Available class schedules retrieved successfully.",
      data: schedules,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Book a class schedule
exports.bookClass = async (req, res, next) => {
  const { scheduleId } = req.body;

  try {
    const schedule = await ClassSchedule.findById(scheduleId);

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Class schedule not found.",
        errorDetails: `No schedule with id ${scheduleId} found.`,
      });
    }

    // Check if schedule is full
    if (schedule.trainees.length >= 10) {
      return res.status(400).json({
        success: false,
        message:
          "Class schedule is full. Maximum 10 trainees allowed per schedule.",
      });
    }

    // Check if trainee already booked a class in the same time slot
    const conflictingBooking = await Booking.findOne({
      trainee: req.user._id,
      classSchedule: {
        $in: await ClassSchedule.find({
          date: schedule.date,
          timeSlot: schedule.timeSlot,
        }).select("_id"),
      },
    });

    if (conflictingBooking) {
      return res.status(400).json({
        success: false,
        message: "Booking conflict.",
        errorDetails: "You have already booked a class in the same time slot.",
      });
    }

    // Create booking
    const booking = await Booking.create({
      trainee: req.user._id,
      classSchedule: schedule._id,
    });

    // Add trainee to class schedule
    schedule.trainees.push(req.user._id);
    await schedule.save();

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Class booked successfully.",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a booking
exports.cancelBooking = async (req, res, next) => {
  const { bookingId } = req.params;

  try {
    const booking = await Booking.findById(bookingId).populate("classSchedule");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
        errorDetails: `No booking with id ${bookingId} found.`,
      });
    }

    // Ensure the booking belongs to the trainee
    if (booking.trainee.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access.",
        errorDetails: "You can only cancel your own bookings.",
      });
    }

    // Remove booking
    await booking.remove();

    // Remove trainee from class schedule
    const schedule = await ClassSchedule.findById(booking.classSchedule._id);
    schedule.trainees.pull(req.user._id);
    await schedule.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Booking cancelled successfully.",
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Trainee's Bookings
exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ trainee: req.user._id }).populate({
      path: "classSchedule",
      populate: {
        path: "trainer",
        populate: { path: "user", select: "name email" },
      },
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Your bookings retrieved successfully.",
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};
