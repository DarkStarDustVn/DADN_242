const express = require("express");
const {
    fetchBbcHumidityData,
    fetchBbcLedData,
    fetchBbcTempData
} = require("../controllers/feedController");

const router = express.Router();

router.get("/humidity", fetchBbcHumidityData);
router.get("/led", fetchBbcLedData);
router.get("/temp", fetchBbcTempData);

module.exports = router;
