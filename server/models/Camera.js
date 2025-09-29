const mongoose = require("mongoose");

const cameraSchema = new mongoose.Schema({
  name: { type: String, required: true },
  pricePerDay: { type: Number, required: true }, // Regular rental price
  offerPrice: { type: Number }, // Optional special offer price
  description: { type: String },
  image: { type: String },
  inclusions: [{ type: String }],
  specs: { type: Map, of: String },
});

module.exports = mongoose.model("Camera", cameraSchema);
