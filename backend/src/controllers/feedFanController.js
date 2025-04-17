const FeedFan = require("../models/FeedFan");

// Lấy tất cả dữ liệu của feed Fan
exports.getAllFanData = async (req, res) => {
    try {
        const data = await FeedFan.find({});
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Lấy theo id
exports.getFanDataById = async (req, res) => {
    try {
        const { id } = req.params;
        const document = await FeedFan.findById(id);
        if (!document) {
            return res.status(404).json({ message: "Data not found" });
        }
        res.status(200).json(document);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Tạo mới
exports.createFanData = async (req, res) => {
    try {
        const newDocument = new FeedFan(req.body);
        const savedDocument = await newDocument.save();
        res.status(201).json(savedDocument);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Cập nhật theo id
exports.updateFanData = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedDocument = await FeedFan.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedDocument) {
            return res.status(404).json({ message: "Data not found" });
        }
        res.status(200).json(updatedDocument);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Xóa theo id
exports.deleteFanData = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedDocument = await FeedFan.findByIdAndDelete(id);
        if (!deletedDocument) {
            return res.status(404).json({ message: "Data not found" });
        }
        res.status(200).json({ message: "Data deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
