// src/routes/feedCrudRoutes.js
const express = require("express");
const router = express.Router();
const feedLedController = require("../controllers/feedLedController");

// Các endpoint cho FeedHumidity
router.get("/", feedLedController.getAllLedData);
router.get("/:id", feedLedController.getLedDataById);
router.post("/", feedLedController.createLedData);
router.put("/:id", feedLedController.updateLedData);
router.delete("/:id", feedLedController.deleteLedData);

module.exports = router;
