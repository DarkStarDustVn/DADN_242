const FeedHumidity = require("../models/FeedHumidity");

// Lấy tất cả dữ liệu của feed humidity
exports.getAllHumidityData = async (req, res) => {
    try {
        const data = await FeedHumidity.find({});
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Lấy theo id
exports.getHumidityDataById = async (req, res) => {
    try {
        const { id } = req.params;
        const document = await FeedHumidity.findById(id);
        if (!document) {
            return res.status(404).json({ message: "Data not found" });
        }
        res.status(200).json(document);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Tạo mới
exports.createHumidityData = async (req, res) => {
    try {
        const newDocument = new FeedHumidity(req.body);
        const savedDocument = await newDocument.save();
        res.status(201).json(savedDocument);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Cập nhật theo id
exports.updateHumidityData = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedDocument = await FeedHumidity.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedDocument) {
            return res.status(404).json({ message: "Data not found" });
        }
        res.status(200).json(updatedDocument);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Xóa theo id
exports.deleteHumidityData = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedDocument = await FeedHumidity.findByIdAndDelete(id);
        if (!deletedDocument) {
            return res.status(404).json({ message: "Data not found" });
        }
        res.status(200).json({ message: "Data deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
