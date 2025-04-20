const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ["light", "ac", "fan", "tv", "other", "state"],
    },
    status: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: true },
    power: { type: Number, default: 0 }, // công suất (W)
    speed: {
      type: Number,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

const Device = mongoose.model("Device", deviceSchema);
module.exports = Device;
