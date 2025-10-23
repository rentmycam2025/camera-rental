const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    contact: { type: String, required: true },
    address: { type: String, required: true },
    emergencyContact: { type: String, required: true },
    idProofUrl: { type: String, required: true },
    userPhotoUrl: { type: String, required: true },

    cameras: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Camera", required: true },
    ],
    accessories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Accessory",
        required: true,
      },
    ],
    rentalPeriod: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
