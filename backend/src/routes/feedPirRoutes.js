// src/routes/feedCrudRoutes.js
const express = require("express");
const router = express.Router();
const feedPirController = require("../controllers/feedPirController");

// Các endpoint cho FeedHumidity
router.get("/", feedPirController.getAllPirData);
router.get("/:id", feedPirController.getPirDataById);
router.post("/", feedPirController.createPirData);
router.put("/:id", feedPirController.updatePirData);
router.delete("/:id", feedPirController.deletePirData);

module.exports = router;
