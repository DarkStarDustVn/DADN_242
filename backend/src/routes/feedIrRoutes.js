// src/routes/feedCrudRoutes.js
const express = require("express");
const router = express.Router();
const feedIrController = require("../controllers/feedIrController");

// Các endpoint cho FeedHumidity
router.get("/", feedIrController.getAllIrData);
router.get("/:id", feedIrController.getIrDataById);
router.post("/", feedIrController.createIrData);
router.put("/:id", feedIrController.updateIrData);
router.delete("/:id", feedIrController.deleteIrData);

module.exports = router;
