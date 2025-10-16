const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const { apiKeyAuth } = require("./middleware/apiKeyAuth");

// Routes
const camerasRoutes = require("./routes/cameras");
const accessoriesRoutes = require("./routes/accessories");
const bookingsRoutes = require("./routes/bookings");
const authRoutes = require("./routes/auth");

const app = express();

// Allowed origins from .env
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (mobile apps, curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // include OPTIONS
    allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
    credentials: true,
  })
);

// Parse JSON
app.use(bodyParser.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes with API key protection
app.use("/api/auth", apiKeyAuth, authRoutes);
app.use("/api/cameras", apiKeyAuth, camerasRoutes);
app.use("/api/accessories", apiKeyAuth, accessoriesRoutes);
app.use("/api/bookings", apiKeyAuth, bookingsRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Rent My Cam Backend is healthy and running!",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
