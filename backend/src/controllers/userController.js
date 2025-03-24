const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Đăng ký người dùng mới: [POST] /api/users/register
const registerUser = async (req, res) => {
  try {
    const { email, password, firstName, lastName, sex, phone, address } =
      req.body;

    // Kiểm tra email đã tồn tại chưa
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const newUser = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      sex,
      phone,
      address,
    });

    // Lưu vào database
    await newUser.save();

    // Trả về response với token
    res.status(201).json({
      _id: newUser._id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      token: generateToken(newUser._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Đăng nhập user (Login): [POST] /api/users/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra user có tồn tại không
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email chưa được đăng ký!" });
    }

    // So sánh password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu không chính xác!" });
    }

    // Trả về thông tin user và token
    res.json({
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

//  Lấy danh sách thông tin tất cả users (READ): [GET] /api/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi thực hiện getAllUsers!",
      error: error.message,
    });
  }
};

// Lấy thông tin 1 user bằng id: [GET]: /api/users/:id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password"); // Ẩn password
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy User ID" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi thực hiện getUserById!" });
  }
};

//  Cập nhật user theo ID (UPDATE): [PUT]: /api/users/:id
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra ObjectId có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "User ID không hợp lệ" });
    }

    // Tìm user trong database
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    // Nếu có trường password, băm mật khẩu trước khi cập nhật
    if (req.body.password) {
      req.body.password = bcrypt.hash(req.body.password, 10);
    }

    // Cập nhật user với các dữ liệu mới
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true, // Trả về dữ liệu sau khi update
      runValidators: true, // Áp dụng các validate trong schema User.js
    });

    res.status(200).json({ message: "Cập nhật thành công", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

//  Xóa user theo ID (DELETE)
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User đã bị xóa!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
};
