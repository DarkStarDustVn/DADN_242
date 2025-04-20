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
      validate: {
        validator: function (value) {
          // Nếu type là 'fan' thì speed là bắt buộc
          if (this.type === "fan") return value != null;
          // Nếu không phải fan thì speed nên undefined hoặc null
          return value == null;
        },
        message: function (props) {
          return `Thuộc tính 'speed' chỉ áp dụng với thiết bị quạt (fan).`;
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

const Device = mongoose.model("Device", deviceSchema);
module.exports = Device;
