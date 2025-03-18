// src/routes/feedCrudRoutes.js
const express = require("express");
const router = express.Router();
const feedHumidityController = require("../controllers/feedHumidityController");

// Các endpoint cho FeedHumidity
router.get("/", feedHumidityController.getAllHumidityData);
router.get("/:id", feedHumidityController.getHumidityDataById);
router.post("/", feedHumidityController.createHumidityData);
router.put("/:id", feedHumidityController.updateHumidityData);
router.delete("/:id", feedHumidityController.deleteHumidityData);

module.exports = router;
