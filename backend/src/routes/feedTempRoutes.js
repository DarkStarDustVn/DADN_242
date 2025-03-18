// src/routes/feedCrudRoutes.js
const express = require("express");
const router = express.Router();
const feedTempController = require("../controllers/feedTempController");

// Các endpoint cho FeedHumidity
router.get("/", feedTempController.getAllTempData);
router.get("/:id", feedTempController.getTempDataById);
router.post("/", feedTempController.createTempData);
router.put("/:id", feedTempController.updateTempData);
router.delete("/:id", feedTempController.deleteTempData);

module.exports = router;
