const mongoose = require("mongoose");

const feedSchema = new mongoose.Schema({
    _id: { type: String }, // Lấy từ item.id của Adafruit
    value: mongoose.Schema.Types.Mixed,
    feed_id: Number,
    feed_key: String,
    created_at: Date,
    created_epoch: Number,
    expiration: Date,
    feedName: String,
}, { versionKey: false, strict: false });

module.exports = mongoose.model("FeedTemp", feedSchema, "bbc_temp");
