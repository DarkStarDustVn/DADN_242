// src/controllers/feedCrudController.js
const FeedTemp = require("../models/FeedTemp");

// Lấy tất cả dữ liệu của feed humidity
exports.getAllTempData = async (req, res) => {
    try {
        const data = await FeedTemp.find({});
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Lấy một document theo id
exports.getTempDataById = async (req, res) => {
    try {
        const { id } = req.params;
        const document = await FeedTemp.findById(id);
        if (!document) {
            return res.status(404).json({ message: "Data not found" });
        }
        res.status(200).json(document);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Tạo một document mới (nếu cần thiết, ví dụ cho testing)
exports.createTempData = async (req, res) => {
    try {
        const newDocument = new FeedTemp(req.body);
        const savedDocument = await newDocument.save();
        res.status(201).json(savedDocument);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Cập nhật một document theo id
exports.updateTempData = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedDocument = await FeedTemp.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedDocument) {
            return res.status(404).json({ message: "Data not found" });
        }
        res.status(200).json(updatedDocument);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Xóa một document theo id
exports.deleteTempData = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedDocument = await FeedTemp.findByIdAndDelete(id);
        if (!deletedDocument) {
            return res.status(404).json({ message: "Data not found" });
        }
        res.status(200).json({ message: "Data deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
