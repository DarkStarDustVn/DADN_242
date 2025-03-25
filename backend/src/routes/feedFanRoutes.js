// src/routes/feedCrudRoutes.js
const express = require("express");
const router = express.Router();
const feedFanController = require("../controllers/feedFanController");

// Các endpoint cho FeedHumidity
router.get("/", feedFanController.getAllFanData);
router.get("/:id", feedFanController.getFanDataById);
router.post("/", feedFanController.createFanData);
router.put("/:id", feedFanController.updateFanData);
router.delete("/:id", feedFanController.deleteFanData);

module.exports = router;
