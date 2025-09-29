const mongoose = require("mongoose");

const accessorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  pricePerDay: { type: Number, required: true },
  offerPrice: { type: Number },
  description: { type: String },
  image: { type: String },
  specs: { type: Map, of: String },
});

module.exports = mongoose.model("Accessory", accessorySchema);
