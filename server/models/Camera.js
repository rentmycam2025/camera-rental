const mongoose = require("mongoose");

const DEFAULT_IMAGE =
  "https://res.cloudinary.com/dhqhk1k3t/image/upload/v1760359879/placeholder_logo_z6ko7r.png";

const cameraSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    offerPrice: { type: Number },
    description: { type: String },
    image: { type: String, default: DEFAULT_IMAGE },
    category: { type: String, default: "camera", enum: ["camera"] }, // Fixed category
    inclusions: [{ type: String }],
    specs: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Camera", cameraSchema);
