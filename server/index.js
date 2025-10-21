const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const compression = require("compression");
const helmet = require("helmet");
require("dotenv").config();

const { apiKeyAuth } = require("./middleware/apiKeyAuth");

// Routes
const camerasRoutes = require("./routes/cameras");
const accessoriesRoutes = require("./routes/accessories");
const bookingsRoutes = require("./routes/bookings");
const authRoutes = require("./routes/auth");

const app = express();

// ---------- SECURITY & PERFORMANCE MIDDLEWARE ----------
app.use(helmet()); // Adds security headers (CSP, HSTS, XSS protection, etc.)
app.use(compression()); // Gzip/Brotli compression for API responses

// ---------- CORS ----------
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
    credentials: true,
  })
);

// ---------- BODY PARSER ----------
app.use(bodyParser.json({ limit: "10mb" })); // prevent huge payloads

// ---------- MONGO CONNECTION ----------
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ---------- API ROUTES WITH API KEY ----------
app.use("/api/auth", apiKeyAuth, authRoutes);
app.use("/api/cameras", apiKeyAuth, camerasRoutes);
app.use("/api/accessories", apiKeyAuth, accessoriesRoutes);
app.use("/api/bookings", apiKeyAuth, bookingsRoutes);

// ---------- SIMPLE PAGINATION MIDDLEWARE EXAMPLE ----------
app.use((req, res, next) => {
  req.query.page = parseInt(req.query.page) || 1;
  req.query.limit = parseInt(req.query.limit) || 20;
  next();
});

// ---------- HEALTH CHECK ----------
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Rent My Cam Backend is healthy and running!",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ---------- ERROR HANDLER ----------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});

// ---------- START SERVER ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
