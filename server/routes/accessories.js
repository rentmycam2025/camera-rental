const express = require("express");
const router = express.Router();
const Accessory = require("../models/Accessory");

// GET all accessories
router.get("/", async (req, res) => {
  const accessories = await Accessory.find();
  res.json(accessories);
});

// POST add accessory
router.post("/", async (req, res) => {
  const accessory = new Accessory(req.body);
  await accessory.save();
  res.status(201).json(accessory);
});

// PUT update accessory
router.put("/:id", async (req, res) => {
  const updated = await Accessory.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
});

// DELETE accessory
router.delete("/:id", async (req, res) => {
  await Accessory.findByIdAndDelete(req.params.id);
  res.json({ message: "Accessory deleted" });
});

module.exports = router;
