const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");


require("dotenv").config();

const camerasRoutes = require("./routes/cameras");
const accessoriesRoutes = require("./routes/accessories");
const bookingsRoutes = require("./routes/bookings");

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

app.use("/api/cameras", camerasRoutes);
app.use("/api/accessories", accessoriesRoutes);
app.use("/api/bookings", bookingsRoutes);

app.get("/", (req, res) => res.send("Camera Rental Backend Running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
