const express = require("express");
const cors = require("cors");
const userRoutes = require("./src/routes/useRoutes");

const User = require("./src/models/User");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

const connectDB = require("./src/config/database");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 8000;

// Database Connect With MongoDB
connectDB();

// Middleware để xử lý JSON
app.use(express.json());
app.use(cors());

// API Creation
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

// // Image Storage Engine

// const storage = multer.diskStorage({
//   destination: "./upload/images",
//   filename: (req, file, cb) => {
//     return cb(
//       null,
//       `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
//     );
//   },
// });

// const upload = multer({ storage: storage });

// // Creating Upload Endpoint for images
// app.use("/images", express.static("upload/images"));
// app.post("/upload", upload.single("product"), (req, res) => {
//   res.json({
//     success: 1,
//     image_url: `http://localhost:${port}/images/${req.file.filename}`,
//   });
// });

app.listen(port, (error) => {
  if (!error) {
    console.log(`Server Running on Port http://localhost:${port}`);
  } else {
    console.log("Error: " + error);
  }
});
