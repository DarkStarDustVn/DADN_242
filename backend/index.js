const express = require("express");
const cors = require("cors");

const User = require("./src/models/User");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

const connectDB = require("./src/config/database");
const authRoutes = require("./src/routes/authRoutes")
const userRoutes = require("./src/routes/useRoutes");
const deviceRoutes = require("./src/routes/deviceRoutes")
const feedRoutes = require("./src/routes/feedRoutes"); // route đã dùng để fetch dữ liệu từ Adafruit
const feedHumidityRoutes = require("./src/routes/feedHumidityRoutes"); // route CRUD
const feedLedRoutes = require("./src/routes/feedLedRoutes"); // route CRUD
const feedTempRoutes = require("./src/routes/feedTempRoutes"); // route CRUD
const feedFanRoutes = require("./src/routes/feedFanRoutes"); // route CRUD
const feedIrRoutes = require("./src/routes/feedIrRoutes"); // route CRUD
const feedPirRoutes = require("./src/routes/feedPirRoutes"); // route CRUD
require("dotenv").config();

const app = express();
const port = process.env.PORT || 8000;

connectDB();

app.use(express.json());
app.use(cors());

// API Creation
app.use("/api/users", userRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/devices", deviceRoutes);

app.use("/feeds", feedRoutes); // API fetch dữ liệu từ Adafruit
app.use("/api/humidity", feedHumidityRoutes); // API CRUD cho dữ liệu lấy từ Adafruit
app.use("/api/led", feedLedRoutes); // API CRUD cho dữ liệu lấy từ Adafruit
app.use("/api/temp", feedTempRoutes); // API CRUD cho dữ liệu lấy từ Adafruit
app.use("/api/fan", feedFanRoutes); // API CRUD cho dữ liệu lấy từ Adafruit
app.use("/api/ir", feedIrRoutes); // API CRUD cho dữ liệu lấy từ Adafruit
app.use("/api/pir", feedPirRoutes); // API CRUD cho dữ liệu lấy từ Adafruit

app.get("/", (req, res) => {
  res.send("BackEnd SmartHome Group 13!!!");
});

// Kích hoạt scheduler
require("./src/scheduler/scheduler");

app.listen(port, (error) => {
  if (!error) {
    console.log(`Server Running on Port http://localhost:${port}`);
  } else {
    console.error("Error: " + error);
  }
});
