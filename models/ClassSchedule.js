const mongoose = require("mongoose");

const ClassScheduleSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String, // e.g., "08:00-10:00"
      required: true,
    },
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trainer",
      required: true,
    },
    trainees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

// Ensure unique combination of date and timeSlot
ClassScheduleSchema.index({ date: 1, timeSlot: 1 }, { unique: true });

module.exports = mongoose.model("ClassSchedule", ClassScheduleSchema);
