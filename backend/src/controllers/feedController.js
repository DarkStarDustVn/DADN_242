const axios = require("axios");
require("dotenv").config();

const FeedHumidity = require("../models/FeedHumidity");
const FeedLed = require("../models/FeedLed");
const FeedTemp = require("../models/FeedTemp");

const AIO_USERNAME = process.env.AIO_USERNAME;
const AIO_KEY = process.env.AIO_KEY;

// fetch và lưu dữ liệu của một feed
const fetchAndStoreFeed = async (feedName, Model) => {
    try {
        const url = `https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds/${feedName}/data?limit=100`;


        const { data } = await axios.get(url, {
            headers: { "X-AIO-Key": AIO_KEY }
        });

        if (Array.isArray(data) && data.length > 0) {
            const item = data[0]; // Chỉ lấy phần tử mới nhất

            // Kiểm tra nếu dữ liệu đã tồn tại
            const existingDoc = await Model.findOne({ _id: item.id });
            if (!existingDoc) {
                const doc = new Model({
                    ...item,
                    _id: item.id,  // Dùng id của Adafruit làm _id
                    feedName: feedName,
                });

                await doc.save();
                console.log(`${feedName}: Inserted new data`);
                return { feedName, inserted: true };
            } else {
                console.log(`${feedName}: No new data`);
                return { feedName, inserted: false };
            }
        } else {
            return { feedName, insertedCount: 0 };
        }

    } catch (error) {
        throw error;
    }
};

// bbc-humidity
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

// bbc-led
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

// bbc-temp
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
