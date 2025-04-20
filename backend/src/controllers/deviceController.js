const mongoose = require("mongoose");
const Device = require("../models/Device");

// [GET] /api/devices/all
const getAllDevices = async (req, res) => {
    try {
      const devices = await Device.find();
      res.status(200).json(devices);
    } catch (err) {
      res.status(500).json({ message: "Không thể lấy danh sách thiết bị", error: err.message });
    }
};

// [GET] /api/devices/:id
const getDeviceById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID thiết bị không hợp lệ" });
    }
    const device = await Device.findById(id);
    if (!device) {
      return res.status(404).json({ message: "Không tìm thấy thiết bị" });
    }
    res.json(device);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// [GET] /api/devices?search=...
const getDevices = async (req, res) => {
    try {
        const { search, status, isOnline, type, page = 1, limit = 10, sortBy = "createdAt", order = "desc" } = req.query;
    
        const filter = {};
    
        if (search) filter.name = new RegExp(search, "i");
        if (status !== undefined) filter.status = status === "true";
        if (isOnline !== undefined) filter.isOnline = isOnline === "true";
        if (type) filter.type = type;
    
        const total = await Device.countDocuments(filter);
        
        const sortField = sortBy === "power" ? "power" : "createdAt";
        const sortOrder = order === "asc" ? 1 : -1;
        
        const devices = await Device.find(filter)
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(parseInt(limit));
    
        res.json({ total, page: parseInt(page), limit: parseInt(limit), devices });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
};

// [POST] /api/devices
const createDevice = async (req, res) => {
  try {
    const { name, type, status, isOnline, power, speed } = req.body;

    // Nếu là fan thì speed là bắt buộc
    if (type === 'fan' && (speed === undefined || speed === null)) {
      return res.status(400).json({ message: "Thiết bị quạt cần có tốc độ (speed)" });
    }

    // Nếu không phải fan mà có speed thì từ chối
    if (type !== 'fan' && speed !== undefined) {
      return res.status(400).json({ message: "Chỉ thiết bị quạt mới được khai báo speed" });
    }

    const newDevice = await Device.create({
      name,
      type,
      status,
      isOnline,
      power,
      ...(type === 'fan' && { speed }) // chỉ thêm speed nếu là fan)
    });
    res.status(201).json(newDevice);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Dữ liệu không hợp lệ", error: err.message });
  }
};

// [PUT] /api/devices/:id
const updateDevice = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID thiết bị không hợp lệ" });
    }

     // Nếu đang cập nhật sang type fan → speed bắt buộc
     if (type === 'fan' && (speed === undefined || speed === null)) {
      return res.status(400).json({ message: "Quạt cần có tốc độ (speed)" });
    }

    // Nếu không phải fan mà có speed thì từ chối
    if (type !== 'fan' && speed !== undefined) {
      return res.status(400).json({ message: "Chỉ quạt mới được có speed" });
    }
    const updated = await Device.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ message: "Không tìm thấy thiết bị" });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Cập nhật thất bại", error: err.message });
  }
};

// [DELETE] /api/devices/:id
const deleteDevice = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID thiết bị không hợp lệ" });
    }
    const deleted = await Device.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Không tìm thấy thiết bị" });
    }
    res.json({ message: "Xóa thiết bị thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

module.exports = {
  getAllDevices,
  getDeviceById,
  getDevices,
  createDevice,
  updateDevice,
  deleteDevice,
};
