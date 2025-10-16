const express = require("express");
const router = express.Router();
const Camera = require("../models/Camera");
const { authMiddleware, adminOnly } = require("../middleware/authMiddleware");

// GET all cameras
router.get("/", async (req, res) => {
  const cameras = await Camera.find();
  res.json(cameras);
});

// GET by ID
router.get("/:id", async (req, res) => {
  const camera = await Camera.findById(req.params.id);
  if (!camera) return res.status(404).json({ message: "Camera not found" });
  res.json(camera);
});

// POST add camera
router.post("/", authMiddleware, adminOnly, async (req, res) => {
  const camera = new Camera(req.body);
  await camera.save();
  res.status(201).json(camera);
});

// PUT update camera
router.put("/:id", authMiddleware, adminOnly, async (req, res) => {
  const updated = await Camera.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
});

// DELETE camera
router.delete("/:id", authMiddleware, adminOnly, async (req, res) => {
  await Camera.findByIdAndDelete(req.params.id);
  res.json({ message: "Camera deleted" });
});

module.exports = router;
