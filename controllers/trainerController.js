const ClassSchedule = require("../models/ClassSchedule");
const Trainer = require("../models/Trainer");

// @desc    Get assigned class schedules for a Trainer
exports.getAssignedSchedules = async (req, res, next) => {
  try {
    const trainer = await Trainer.findOne({ user: req.user._id });
    console.log("trainer ", trainer);
    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer profile not found.",
        errorDetails: `No trainer profile associated with user id ${req.user._id}.`,
      });
    }

    const schedules = await ClassSchedule.find({ trainer: trainer._id })
      .populate("trainees", "name email")
      .populate("trainer", "user name");

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Assigned class schedules retrieved successfully.",
      data: schedules,
    });
  } catch (error) {
    next(error);
  }
};
