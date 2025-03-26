const express = require("express");
const {
    fetchBbcHumidityData,
    fetchBbcLedData,
    fetchBbcTempData,
    fetchBbcFanData,
    fetchBbcIrData,
    fetchBbcPirData,

} = require("../controllers/feedController");

const router = express.Router();

router.get("/humidity", fetchBbcHumidityData);
router.get("/led", fetchBbcLedData);
router.get("/temp", fetchBbcTempData);
router.get("/fan", fetchBbcFanData);
router.get("/ir", fetchBbcIrData);
router.get("/pir", fetchBbcPirData);

module.exports = router;
