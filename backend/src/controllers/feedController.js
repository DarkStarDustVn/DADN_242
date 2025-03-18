const axios = require("axios");
require("dotenv").config();

const FeedHumidity = require("../models/FeedHumidity");
const FeedLed = require("../models/FeedLed");
const FeedTemp = require("../models/FeedTemp");

const AIO_USERNAME = process.env.AIO_USERNAME;
const AIO_KEY = process.env.AIO_KEY;

// Hàm dùng chung để fetch và lưu dữ liệu của một feed
const fetchAndStoreFeed = async (feedName, Model) => {
    try {
        const url = `https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds/${feedName}/data?limit=100`;


        const { data } = await axios.get(url, {
            headers: { "X-AIO-Key": AIO_KEY }
        });


        if (Array.isArray(data) && data.length > 0) {
            // Map mỗi item: gán _id từ item.id và thêm feedName nếu cần
            const docs = data.map(item => ({
                ...item,
                _id: item.id,   // Dùng id của Adafruit làm _id để tránh trùng lặp
                feedName: feedName,
            }));

            // Thêm tùy chọn { ordered: false } để nếu có lỗi duplicate, các document khác vẫn được insert
            const insertedDocs = await Model.insertMany(docs, { ordered: false });
            return { feedName, insertedCount: insertedDocs.length };
        } else {
            return { feedName, insertedCount: 0 };
        }
    } catch (error) {
        throw error;
    }
};

// Controller cho bbc-humidity
exports.fetchBbcHumidityData = async (req, res) => {
    try {
        const result = await fetchAndStoreFeed("bbc-humidity", FeedHumidity);
        res.status(200).json({
            message: "Fetched and stored bbc-humidity data",
            result,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching bbc-humidity data",
            error: error.message,
        });
    }
};

// Controller cho bbc-led
exports.fetchBbcLedData = async (req, res) => {
    try {
        const result = await fetchAndStoreFeed("bbc-led", FeedLed);
        res.status(200).json({
            message: "Fetched and stored bbc-led data",
            result,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching bbc-led data",
            error: error.message,
        });
    }
};

// Controller cho bbc-temp
exports.fetchBbcTempData = async (req, res) => {
    try {
        const result = await fetchAndStoreFeed("bbc-temp", FeedTemp);
        res.status(200).json({
            message: "Fetched and stored bbc-temp data",
            result,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching bbc-temp data",
            error: error.message,
        });
    }
};
