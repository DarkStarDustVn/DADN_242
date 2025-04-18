const express = require("express");
const {
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const router = express.Router();

// Định nghĩa các route API
router.post("/forgot-password", forgotPassword); // Yêu cầu quên mật khẩu
router.post("/reset-password", resetPassword); // Cập nhật mật khẩu mới

module.exports = router;
