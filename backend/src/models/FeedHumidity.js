// src/models/FeedHumidity.js
const mongoose = require("mongoose");

// Định nghĩa schema, sử dụng trường _id là chuỗi (được lấy từ item.id của Adafruit)
const feedSchema = new mongoose.Schema({
    _id: { type: String }, // Lấy từ item.id của Adafruit
    value: mongoose.Schema.Types.Mixed,
    feed_id: Number,
    feed_key: String,
    created_at: Date,
    created_epoch: Number,
    expiration: Date,
    // Bạn có thể lưu thêm trường feedName nếu muốn phân biệt nguồn
    feedName: String,
}, { versionKey: false, strict: false });

module.exports = mongoose.model("FeedHumidity", feedSchema, "bbc_humidity");
