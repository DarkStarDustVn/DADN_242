// src/routes/feedCrudRoutes.js
const express = require("express");
const router = express.Router();
const feedStateController = require("../controllers/feedStateController");

// Các endpoint cho FeedHumidity
router.get("/", feedStateController.getAllStateData);
router.get("/:id", feedStateController.getStateDataById);
router.post("/", feedStateController.createStateData);
router.put("/:id", feedStateController.updateStateData);
router.delete("/:id", feedStateController.deleteStateData);

module.exports = router;
