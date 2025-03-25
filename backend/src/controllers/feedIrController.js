const FeedIr = require("../models/FeedIr");

// Lấy tất cả dữ liệu của feed Ir
exports.getAllIrData = async (req, res) => {
    try {
        const data = await FeedIr.find({});
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Lấy theo id
exports.getIrDataById = async (req, res) => {
    try {
        const { id } = req.params;
        const document = await FeedIr.findById(id);
        if (!document) {
            return res.status(404).json({ message: "Data not found" });
        }
        res.status(200).json(document);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Tạo mới
exports.createIrData = async (req, res) => {
    try {
        const newDocument = new FeedIr(req.body);
        const savedDocument = await newDocument.save();
        res.status(201).json(savedDocument);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Cập nhật theo id
exports.updateIrData = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedDocument = await FeedIr.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedDocument) {
            return res.status(404).json({ message: "Data not found" });
        }
        res.status(200).json(updatedDocument);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Xóa theo id
exports.deleteIrData = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedDocument = await FeedIr.findByIdAndDelete(id);
        if (!deletedDocument) {
            return res.status(404).json({ message: "Data not found" });
        }
        res.status(200).json({ message: "Data deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
