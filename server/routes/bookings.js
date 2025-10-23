// routes/bookingRoutes.js
const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const { authMiddleware, adminOnly } = require("../middleware/authMiddleware");
const multer = require("multer");
const cloudinary = require("../utils/cloudinary"); // your Cloudinary config
const upload = multer({ storage: multer.memoryStorage() });

const {
  sendBookingEmail,
  sendCustomerConfirmationEmail,
  generateWhatsAppLink,
} = require("../utils/emailUtils");

const {
  createBookingData,
  calculateBookingTotal,
  generateDetailedWhatsAppMessage,
} = require("../utils/bookingUtils");

// Helper to upload buffer to Cloudinary with custom filename
const uploadBufferToCloudinary = (buffer, folder, publicId) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, public_id: publicId, overwrite: true },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
};

// Helper to create safe filenames
const slugify = (text) => {
  const now = new Date();
  const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}${String(now.getDate()).padStart(2, "0")}_${String(now.getHours()).padStart(
    2,
    "0"
  )}${String(now.getMinutes()).padStart(2, "0")}${String(
    now.getSeconds()
  ).padStart(2, "0")}`;

  return (
    text
      .toLowerCase()
      .replace(/\s+/g, "_") // spaces to underscores
      .replace(/[^\w-]/g, "") + // remove invalid chars
    `_${dateStr}`
  );
};
// remove invalid characters

// POST create booking
router.post(
  "/",
  upload.fields([
    { name: "idProof", maxCount: 1 },
    { name: "userPhoto", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const name = req.body.fullName;
      if (!name) throw new Error("Name is required for file naming.");

      // Upload files to Cloudinary
      let idProofUrl = null;
      let userPhotoUrl = null;

      if (req.files.idProof) {
        const file = req.files.idProof[0];
        const fileName = slugify(name + "_idProof");
        idProofUrl = await uploadBufferToCloudinary(
          file.buffer,
          "rentmycam/idProofs",
          fileName
        );
      }

      if (req.files.userPhoto) {
        const file = req.files.userPhoto[0];
        const fileName = slugify(name + "_userPhoto");
        userPhotoUrl = await uploadBufferToCloudinary(
          file.buffer,
          "rentmycam/userPhotos",
          fileName
        );
      }

      // Create booking data
      const bookingData = createBookingData(req.body, req.files);
      bookingData.idProofUrl = idProofUrl;
      bookingData.userPhotoUrl = userPhotoUrl;

      // Save booking
      let booking = await Booking.create(bookingData);

      // Populate cameras & accessories
      booking = await Booking.findById(booking._id).populate(
        "cameras accessories"
      );

      // Calculate total amount
      const { totalAmount } = calculateBookingTotal(booking);
      booking.totalAmount = totalAmount;
      await booking.save();

      // Send response immediately
      res.status(201).json({
        success: true,
        message: "Booking created successfully",
        booking,
        whatsappMessage: generateDetailedWhatsAppMessage(booking),
      });

      // Send emails asynchronously
      setImmediate(() => {
        sendBookingEmail(booking, req.files).catch((err) =>
          console.error("Admin email failed:", err)
        );
        sendCustomerConfirmationEmail(booking).catch((err) =>
          console.error("Customer email failed:", err)
        );
      });
    } catch (err) {
      console.error("Booking creation error:", err);

      const validationErrors = err.errors
        ? Object.values(err.errors).map((e) => e.message)
        : null;

      res.status(400).json({
        success: false,
        message: err.message,
        validationErrors,
      });
    }
  }
);

// GET all bookings
router.get("/", authMiddleware, adminOnly, async (req, res) => {
  try {
    const bookings = await Booking.find().populate("cameras accessories");
    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single booking
router.get("/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate(
      "cameras accessories"
    );
    if (!booking)
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });

    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update booking
router.put("/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("cameras accessories");

    if (!booking)
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });

    // Send confirmation email if status changed to "Confirmed"
    if (req.body.status === "Confirmed") {
      sendCustomerConfirmationEmail(booking).catch((err) =>
        console.error("Confirmation email sending failed:", err)
      );
    }

    res.json({
      success: true,
      message: "Booking updated successfully",
      booking,
      whatsappMessage: generateDetailedWhatsAppMessage(booking),
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE booking
router.delete("/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking)
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });

    res.json({ success: true, message: "Booking deleted successfully" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// GET WhatsApp message
router.get("/:id/wa-message", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate(
      "cameras accessories"
    );

    if (!booking)
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });

    const message = generateDetailedWhatsAppMessage(booking);
    res.json({ success: true, message });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET WhatsApp link
router.get("/:id/wa-link", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate(
      "cameras accessories"
    );

    if (!booking)
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });

    const waLink = generateWhatsAppLink(booking.contact, booking);
    const message = generateDetailedWhatsAppMessage(booking);

    res.json({ success: true, waLink, message });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET booking status
router.get("/:id/status", authMiddleware, adminOnly, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking)
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });

    res.json({
      success: true,
      status: booking.status,
      updatedAt: booking.updatedAt,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
