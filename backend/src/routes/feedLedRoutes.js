const express = require("express");
const router = express.Router();
const feedLedController = require("../controllers/feedLedController");

router.get("/", feedLedController.getAllLedData);
router.get("/:id", feedLedController.getLedDataById);
router.post("/", feedLedController.createLedData);
router.put("/:id", feedLedController.updateLedData);
router.delete("/:id", feedLedController.deleteLedData);

module.exports = router;
