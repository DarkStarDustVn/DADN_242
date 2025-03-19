const express = require("express");
const router = express.Router();
const feedHumidityController = require("../controllers/feedHumidityController");

router.get("/", feedHumidityController.getAllHumidityData);
router.get("/:id", feedHumidityController.getHumidityDataById);
router.post("/", feedHumidityController.createHumidityData);
router.put("/:id", feedHumidityController.updateHumidityData);
router.delete("/:id", feedHumidityController.deleteHumidityData);

module.exports = router;
