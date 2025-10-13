const mongoose = require("mongoose");

const cameraSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    offerPrice: { type: Number },
    description: { type: String },
    image: { type: String },
    category: { type: String, default: "camera", enum: ["camera"] }, // Fixed category
    inclusions: [{ type: String }],
    specs: { type: Map, of: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Camera", cameraSchema);
