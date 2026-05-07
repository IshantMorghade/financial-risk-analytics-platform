// src/app.js
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const dataRoutes = require("./routes/dataRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const adminRoutes = require("./routes/adminRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

// Global middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/data", dataRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/report", reportRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ status: "FinRisk Insight API running" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

module.exports = app;

