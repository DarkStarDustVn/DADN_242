const FeedPir = require("../models/FeedPir");

// Lấy tất cả dữ liệu của feed Pir
exports.getAllPirData = async (req, res) => {
    try {
        const data = await FeedPir.find({});
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Lấy theo id
exports.getPirDataById = async (req, res) => {
    try {
        const { id } = req.params;
        const document = await FeedPir.findById(id);
        if (!document) {
            return res.status(404).json({ message: "Data not found" });
        }
        res.status(200).json(document);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Tạo mới
exports.createPirData = async (req, res) => {
    try {
        const newDocument = new FeedPir(req.body);
        const savedDocument = await newDocument.save();
        res.status(201).json(savedDocument);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Cập nhật theo id
exports.updatePirData = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedDocument = await FeedPir.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedDocument) {
            return res.status(404).json({ message: "Data not found" });
        }
        res.status(200).json(updatedDocument);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Xóa theo id
exports.deletePirData = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedDocument = await FeedPir.findByIdAndDelete(id);
        if (!deletedDocument) {
            return res.status(404).json({ message: "Data not found" });
        }
        res.status(200).json({ message: "Data deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
