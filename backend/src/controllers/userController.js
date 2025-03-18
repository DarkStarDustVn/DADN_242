const User = require("../models/User");

//  Tạo user mới (CREATE)
const createUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//  Lấy danh sách user (READ)
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  Cập nhật user theo ID (UPDATE)
const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
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

module.exports = { createUser, getUsers, updateUser, deleteUser };
