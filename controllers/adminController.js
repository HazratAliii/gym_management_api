// backend/controllers/adminController.js
const Trainer = require("../models/Trainer");
const User = require("../models/User");
const ClassSchedule = require("../models/ClassSchedule");

// @desc    Create a Trainer
exports.createTrainer = async (req, res, next) => {
  const { name, email, password, expertise } = req.body;

  try {
    const user = await User.create({
      role: "Trainer",
      name,
      email,
      password,
    });

    const trainer = await Trainer.create({
      user: user._id,
      expertise,
    });

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Trainer created successfully.",
      data: { user, trainer },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a Trainer
exports.updateTrainer = async (req, res, next) => {
  const { trainerId } = req.params;
  const { name, email, password, expertise } = req.body;

  try {
    const trainer = await Trainer.findById(trainerId).populate("user");

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found.",
        errorDetails: `No trainer with id ${trainerId} found.`,
      });
    }

    // Update user details
    if (name) trainer.user.name = name;
    if (email) trainer.user.email = email;
    if (password) trainer.user.password = password;
    await trainer.user.save();

    // Update trainer details
    if (expertise) trainer.expertise = expertise;
    await trainer.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Trainer updated successfully.",
      data: trainer,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a Trainer
exports.deleteTrainer = async (req, res, next) => {
  const { trainerId } = req.params;

  try {
    const trainer = await Trainer.findById(trainerId);

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found.",
        errorDetails: `No trainer with id ${trainerId} found.`,
      });
    }

    // Remove associated user
    await User.findByIdAndDelete(trainer.user);

    // Remove class schedules assigned to this trainer
    await ClassSchedule.deleteMany({ trainer: trainer._id });

    // Remove trainer
    await trainer.remove();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Trainer deleted successfully.",
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create Class Schedule
exports.createClassSchedule = async (req, res, next) => {
  const { date, timeSlot, trainerId } = req.body;

  try {
    // Check if trainer exists
    const trainer = await Trainer.findById(trainerId);
    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found.",
        errorDetails: `No trainer with id ${trainerId} found.`,
      });
    }

    // Check if maximum schedules for the day reached
    const scheduleCount = await ClassSchedule.countDocuments({
      date: new Date(date),
    });
    if (scheduleCount >= 5) {
      return res.status(400).json({
        success: false,
        message: "Schedule limit exceeded.",
        errorDetails: "Cannot create more than 5 schedules per day.",
      });
    }

    // Create class schedule
    const schedule = await ClassSchedule.create({
      date,
      timeSlot,
      trainer: trainer._id,
      trainees: [],
    });

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Class schedule created successfully.",
      data: schedule,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign Trainer to Class Schedule
exports.assignTrainer = async (req, res, next) => {
  const { scheduleId, trainerId } = req.body;

  try {
    const schedule = await ClassSchedule.findById(scheduleId);
    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Class schedule not found.",
        errorDetails: `No schedule with id ${scheduleId} found.`,
      });
    }

    const trainer = await Trainer.findById(trainerId);
    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found.",
        errorDetails: `No trainer with id ${trainerId} found.`,
      });
    }

    schedule.trainer = trainer._id;
    await schedule.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Trainer assigned to class schedule successfully.",
      data: schedule,
    });
  } catch (error) {
    next(error);
  }
};

// Additional Admin functionalities can be added here
