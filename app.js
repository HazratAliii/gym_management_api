// backend/app.js
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const trainerRoutes = require("./routes/trainer");
const traineeRoutes = require("./routes/trainee");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/trainer", trainerRoutes);
app.use("/api/trainee", traineeRoutes);

// Error Handler
app.use(errorHandler);

module.exports = app;
