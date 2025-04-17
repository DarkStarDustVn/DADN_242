const FeedState = require("../models/FeedState");

// Lấy tất cả dữ liệu của feed State
exports.getAllStateData = async (req, res) => {
    try {
        const data = await FeedState.find({});
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Lấy theo id
exports.getStateDataById = async (req, res) => {
    try {
        const { id } = req.params;
        const document = await FeedState.findById(id);
        if (!document) {
            return res.status(404).json({ message: "Data not found" });
        }
        res.status(200).json(document);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Tạo mới
exports.createStateData = async (req, res) => {
    try {
        const newDocument = new FeedState(req.body);
        const savedDocument = await newDocument.save();
        res.status(201).json(savedDocument);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Cập nhật theo id
exports.updateStateData = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedDocument = await FeedState.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedDocument) {
            return res.status(404).json({ message: "Data not found" });
        }
        res.status(200).json(updatedDocument);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Xóa theo id
exports.deleteStateData = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedDocument = await FeedState.findByIdAndDelete(id);
        if (!deletedDocument) {
            return res.status(404).json({ message: "Data not found" });
        }
        res.status(200).json({ message: "Data deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
