const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    idProof: { type: String },
    userPhoto: { type: String },
    contact: { type: String, required: true },
    address: { type: String },
    emergencyContact: { type: String },
    cameras: [{ type: mongoose.Schema.Types.ObjectId, ref: "Camera" }],
    accessories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Accessory" }],
    rentalPeriod: { type: String, required: true },
    status: { type: String, default: "Pending" }, // "Pending", "Confirmed", "Completed"
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
