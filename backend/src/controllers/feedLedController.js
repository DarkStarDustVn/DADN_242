const FeedLed = require("../models/FeedLed");

// Lấy tất cả dữ liệu của feed led
exports.getAllLedData = async (req, res) => {
    try {
        const data = await FeedLed.find({});
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Lấy theo id
exports.getLedDataById = async (req, res) => {
    try {
        const { id } = req.params;
        const document = await FeedLed.findById(id);
        if (!document) {
            return res.status(404).json({ message: "Data not found" });
        }
        res.status(200).json(document);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Tạo mới
exports.createLedData = async (req, res) => {
    try {
        const newDocument = new FeedLed(req.body);
        const savedDocument = await newDocument.save();
        res.status(201).json(savedDocument);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Cập nhật theo id
exports.updateLedData = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedDocument = await FeedLed.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedDocument) {
            return res.status(404).json({ message: "Data not found" });
        }
        res.status(200).json(updatedDocument);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Xóa theo id
exports.deleteLedData = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedDocument = await FeedLed.findByIdAndDelete(id);
        if (!deletedDocument) {
            return res.status(404).json({ message: "Data not found" });
        }
        res.status(200).json({ message: "Data deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
