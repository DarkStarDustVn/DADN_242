
// src/scheduler/scheduler.js
const feedController = require('../controllers/feedController');

// Tạo dummy response object để sử dụng trong scheduler
const dummyRes = {
    status: (code) => ({
        json: (data) => console.log(`Response [${code}]:`, data)
    })
};

// Sử dụng setInterval để gọi fetch liên tục (ví dụ mỗi 60 giây)
const scheduleFetchData = () => {
    setInterval(async () => {
        try {
            console.log("Bắt đầu fetch dữ liệu...");

            // Gọi từng controller với dummy response
            await feedController.fetchBbcHumidityData({}, dummyRes);
            await feedController.fetchBbcLedData({}, dummyRes);
            await feedController.fetchBbcTempData({}, dummyRes);
            await feedController.fetchBbcFanData({}, dummyRes);
            await feedController.fetchBbcIrData({}, dummyRes);
            await feedController.fetchBbcPirData({}, dummyRes);

            console.log("Fetch dữ liệu hoàn tất.");
        } catch (error) {
            console.error("Lỗi khi fetch dữ liệu:", error);
        }
    }, 3600000);
};

scheduleFetchData();
