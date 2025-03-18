const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/database");
const userRoutes = require("./src/routes/useRoutes");
const feedRoutes = require("./src/routes/feedRoutes"); // route đã dùng để fetch dữ liệu từ Adafruit
const feedHumidityRoutes = require("./src/routes/feedHumidityRoutes"); // route CRUD
const feedLedRoutes = require("./src/routes/feedLedRoutes"); // route CRUD
const feedTempRoutes = require("./src/routes/feedTempRoutes"); // route CRUD
require("dotenv").config();

const app = express();
const port = process.env.PORT || 8000;

connectDB();

app.use(express.json());
app.use(cors());

app.use("/users", userRoutes);
app.use("/feeds", feedRoutes);      // API fetch dữ liệu từ Adafruit
app.use("/api/humidity", feedHumidityRoutes); // API CRUD cho dữ liệu lấy từ Adafruit
app.use("/api/led", feedLedRoutes); // API CRUD cho dữ liệu lấy từ Adafruit
app.use("/api/temp", feedTempRoutes); // API CRUD cho dữ liệu lấy từ Adafruit

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Kích hoạt scheduler
require('./src/scheduler/scheduler');

app.listen(port, (error) => {
  if (!error) {
    console.log(`Server Running on Port http://localhost:${port}`);
  } else {
    console.error("Error: " + error);
  }
});
