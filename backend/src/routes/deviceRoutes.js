const express = require("express");
const {
  getAllDevices,
  getDeviceById,
  getDevices,
  createDevice,
  updateDevice,
  deleteDevice
} = require("../controllers/deviceController");

const router = express.Router();

router.get("/all", getAllDevices);      // Lấy thông tin toàn bộ thiết bị
router.get("/:id", getDeviceById);      //Lấy thông tin thiết bị theo id
router.get("/",    getDevices);     // 
router.post("/",   createDevice);       // Tạo thiết bị mới
router.put("/:id", updateDevice);       // Điều chỉnh thông tin thiết bị
router.delete("/:id", deleteDevice);    // Xóa thiết bị

module.exports = router;
