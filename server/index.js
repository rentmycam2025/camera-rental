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
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Routes with API key protection
app.use("/api/auth", apiKeyAuth, authRoutes);
app.use("/api/cameras", apiKeyAuth, camerasRoutes);
app.use("/api/accessories", apiKeyAuth, accessoriesRoutes);
app.use("/api/bookings", apiKeyAuth, bookingsRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Rent My Cam Backend is healthy and running!",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
