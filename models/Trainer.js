const mongoose = require("mongoose");

const TrainerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expertise: {
      type: String,
      required: [true, "Please add expertise details"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trainer", TrainerSchema);
