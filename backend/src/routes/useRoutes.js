const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  getAllUsers,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

// Định nghĩa các route API
router.get("/", getAllUsers); // lấy thông tin toàn bộ users
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/register", registerUser); // đăng ký
router.post("/login", loginUser); // đăng nhập
router.get("/profile", getUserProfile); // lấy thông tin 1 user

module.exports = router;
