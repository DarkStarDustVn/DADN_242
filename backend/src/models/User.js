const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/\S+@\S+\.\S+/, "Email không hợp lệ"],
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    sex: {
      type: String,
    },
    phone: {
      type: String,
      unique: true,
      match: [/^\d{10,15}$/, "Số điện thoại không hợp lệ"],
    },
    address: {
      type: String,
    },
    // Trường dùng cho quên mật khẩu
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
