const axios = require("axios");
require("dotenv").config();

const FeedHumidity = require("../models/FeedHumidity");
const FeedLed = require("../models/FeedLed");
const FeedTemp = require("../models/FeedTemp");
const FeedFan = require("../models/FeedFan");
const FeedIr = require("../models/FeedIr");
const FeedPir = require("../models/FeedPir");



const AIO_USERNAME = process.env.AIO_USERNAME;
const AIO_KEY = process.env.AIO_KEY;

// // fetch và lưu dữ liệu của một feed
// const fetchAndStoreFeed = async (feedName, Model) => {
//     try {
//         const url = `https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds/${feedName}/data?limit=100`;


//         const { data } = await axios.get(url, {
//             headers: { "X-AIO-Key": AIO_KEY }
//         });

//         if (Array.isArray(data) && data.length > 0) {
//             const item = data[0];

//             // Kiểm tra nếu dữ liệu đã tồn tại
//             const existingDoc = await Model.findOne({ _id: item.id });
//             if (!existingDoc) {
//                 const doc = new Model({
//                     ...item,
//                     _id: item.id,  // Dùng id của Adafruit làm _id
//                     feedName: feedName,
//                 });

//                 await doc.save();
//                 console.log(`${feedName}: Inserted new data`);
//                 return { feedName, inserted: true };
//             } else {
//                 console.log(`${feedName}: No new data`);
//                 return { feedName, inserted: false };
//             }
//         } else {
//             return { feedName, insertedCount: 0 };
//         }

//     } catch (error) {
//         throw error;
//     }
// };


const fetchAndStoreFeed = async (feedName, Model) => {
    try {
        let offset = 0;
        const limit = 10000;
        let insertedCount = 0;
        let hasMore = true;

        while (hasMore) {
            const url = `https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds/${feedName}/data?limit=${limit}&offset=${offset}`;
            const { data } = await axios.get(url, {
                headers: { "X-AIO-Key": AIO_KEY }
            });

            // Nếu không có dữ liệu nào thì kết thúc vòng lặp
            if (!Array.isArray(data) || data.length === 0) {
                hasMore = false;
                break;
            }

            // Duyệt từng item trong data trả về
            for (const item of data) {
                // Kiểm tra nếu dữ liệu đã tồn tại (dựa trên _id)
                const existingDoc = await Model.findOne({ _id: item.id });
                if (!existingDoc) {
                    const doc = new Model({
                        ...item,
                        _id: item.id,  // Dùng id của Adafruit làm _id
                        feedName: feedName,
                    });

                    await doc.save();
                    console.log(`${feedName}: Inserted new data with id ${item.id}`);
                    insertedCount++;
                } else {
                    console.log(`${feedName}: Data with id ${item.id} already exists`);
                }
            }

            // Cập nhật offset
            offset += data.length;
        }

        return { feedName, insertedCount };
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

// bbc-fan
exports.fetchBbcFanData = async (req, res) => {
    try {
        const result = await fetchAndStoreFeed("bbc-fan", FeedFan);
        res.status(200).json({
            message: "Fetched and stored bbc-fan data",
            result,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching bbc-fan data",
            error: error.message,
        });
    }
};

// bbc-ir
exports.fetchBbcIrData = async (req, res) => {
    try {
        const result = await fetchAndStoreFeed("bbc-ir", FeedIr);
        res.status(200).json({
            message: "Fetched and stored bbc-ir data",
            result,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching bbc-ir data",
            error: error.message,
        });
    }
};// bbc-pir

exports.fetchBbcPirData = async (req, res) => {
    try {
        const result = await fetchAndStoreFeed("bbc-pir", FeedPir);
        res.status(200).json({
            message: "Fetched and stored bbc-pir data",
            result,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching bbc-pir data",
            error: error.message,
        });
    }
};
