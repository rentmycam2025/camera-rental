const mongoose = require("mongoose");

const accessorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    offerPrice: { type: Number },
    description: { type: String },
    image: { type: String },
    category: { type: String, default: "accessory", enum: ["accessory"] }, // Fixed category
    specs: { type: Map, of: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Accessory", accessorySchema);
