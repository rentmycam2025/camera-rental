// routes/bookingRoutes.js
const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
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

// // Email transporter configuration
// const nodemailer = require("nodemailer");
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// GET all bookings
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().populate("cameras accessories");
    res.json({
      success: true,
      count: bookings.length,
      bookings: bookings,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// GET single booking
router.get("/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate(
      "cameras accessories"
    );
    if (!booking)
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });

    res.json({
      success: true,
      booking: booking,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// POST create booking
router.post(
  "/",
  upload.fields([
    { name: "idProof", maxCount: 1 },
    { name: "userPhoto", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      console.log("Body:", req.body);
      console.log("Files:", req.files);

      // Create booking data using utility function
      const bookingData = createBookingData(req.body, req.files);

      // Create and save booking
      const booking = new Booking(bookingData);
      await booking.save();

      // Populate camera and accessory details
      await booking.populate("cameras accessories");

      // Calculate and update total amount
      const { totalAmount } = calculateBookingTotal(booking);
      booking.totalAmount = totalAmount;
      await booking.save();

      console.log("Booking created successfully:", {
        id: booking._id,
        customer: booking.fullName,
        total: booking.totalAmount,
      });

      // Send email notifications (non-blocking) via Brevo API
      sendBookingEmail(booking, req.files).catch((err) =>
        console.error("Admin email sending failed:", err)
      );

      sendCustomerConfirmationEmail(booking).catch((err) =>
        console.error("Customer email sending failed:", err)
      );

      res.status(201).json({
        success: true,
        message: "Booking created successfully",
        booking: booking,
        whatsappMessage: generateDetailedWhatsAppMessage(booking),
      });
    } catch (err) {
      console.error("Booking creation error:", err);
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }
);

// PUT update booking
router.put("/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("cameras accessories");

    if (!booking)
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });

    // Send confirmation email if status changed to "Confirmed"
    // if (req.body.status === "Confirmed") {
    //   sendCustomerConfirmationEmail(transporter, booking).catch((err) =>
    //     console.error("Confirmation email sending failed:", err)
    //   );
    // }
    if (req.body.status === "Confirmed") {
      sendCustomerConfirmationEmail(booking).catch((err) =>
        console.error("Confirmation email sending failed:", err)
      );
    }

    res.json({
      success: true,
      message: "Booking updated successfully",
      booking: booking,
      whatsappMessage: generateDetailedWhatsAppMessage(booking),
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

// DELETE booking
router.delete("/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking)
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });

    res.json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

// GET WhatsApp message for a booking
router.get("/:id/wa-message", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate(
      "cameras accessories"
    );

    if (!booking)
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });

    const message = generateDetailedWhatsAppMessage(booking);

    res.json({
      success: true,
      message: message,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// GET WhatsApp link for a booking
router.get("/:id/wa-link", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate(
      "cameras accessories"
    );

    if (!booking)
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });

    const waLink = generateWhatsAppLink(booking.contact, booking);
    const message = generateDetailedWhatsAppMessage(booking);

    res.json({
      success: true,
      waLink: waLink,
      message: message,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// GET booking status
router.get("/:id/status", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking)
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });

    res.json({
      success: true,
      status: booking.status,
      updatedAt: booking.updatedAt,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
