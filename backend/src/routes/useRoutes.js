const express = require("express");
const {
  registerUser,
  loginUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

// Định nghĩa các route API
router.get("/", getAllUsers); // lấy thông tin toàn bộ users
router.get("/:id", getUserById); // lấy thông tin 1 user
router.put("/:id", updateUser); // chỉnh sửa thông tin user
router.delete("/:id", deleteUser); // xóa tài khoản user
router.post("/register", registerUser); // đăng ký
router.post("/login", loginUser); // đăng nhập

module.exports = router;
