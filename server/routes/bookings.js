const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Camera = require("../models/Camera");
const Accessory = require("../models/Accessory");
const nodemailer = require("nodemailer");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
// Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// WhatsApp link generator
function generateWhatsAppLink(userNumber, booking) {
  const message = `
Hello ${booking.fullName}, your booking is confirmed!
Rental Period: ${booking.rentalPeriod}

Cameras:
${booking.cameras
  .map(
    (c) =>
      `${c.name} - ₹${c.offerPrice || c.pricePerDay}/day\nImage: ${c.image}`
  )
  .join("\n\n")}

Accessories:
${booking.accessories
  .map(
    (a) =>
      `${a.name} - ₹${a.offerPrice || a.pricePerDay}/day\nImage: ${a.image}`
  )
  .join("\n\n")}

Total: ₹${booking.totalAmount}
Pay here: ${booking.paymentLink}
`;

  return `https://wa.me/${userNumber}?text=${encodeURIComponent(message)}`;
}

// GET all bookings
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().populate("cameras accessories");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single booking
router.get("/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate(
      "cameras accessories"
    );
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
      const {
        fullName,
        contact,
        address,
        emergencyContact,
        cameras,
        accessories,
        rentalPeriod,
      } = req.body;

      const booking = new Booking({
        fullName,
        contact,
        address,
        emergencyContact,
        rentalPeriod,
        cameras,
        accessories,
        status: "Pending",
        idProof: req.files.idProof
          ? {
              data: req.files.idProof[0].buffer,
              contentType: req.files.idProof[0].mimetype,
            }
          : undefined,
        userPhoto: req.files.userPhoto
          ? {
              data: req.files.userPhoto[0].buffer,
              contentType: req.files.userPhoto[0].mimetype,
            }
          : undefined,
      });

      await booking.save();

      // Populate camera and accessory details
      await booking.populate("cameras accessories");

      // Calculate total amount
      const totalAmount =
        booking.cameras.reduce(
          (sum, c) => sum + (c.offerPrice || c.pricePerDay),
          0
        ) +
        booking.accessories.reduce(
          (sum, a) => sum + (a.offerPrice || a.pricePerDay),
          0
        );

      booking.totalAmount = totalAmount;
      booking.paymentLink = "https://yourpaymentlink.com/pay/12345"; // Replace with real link

      // Send email to admin
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL,
        subject: `New Booking Received - ${booking.fullName}`,
        html: `
          <h3>New booking received!</h3>
          <p><strong>Name:</strong> ${booking.fullName}</p>
          <p><strong>Rental Period:</strong> ${booking.rentalPeriod}</p>
          <p><strong>Cameras:</strong> ${booking.cameras
            .map((c) => `${c.name} - ₹${c.offerPrice || c.pricePerDay}/day`)
            .join(", ")}</p>
          <p><strong>Accessories:</strong> ${booking.accessories
            .map((a) => `${a.name} - ₹${a.offerPrice || a.pricePerDay}/day`)
            .join(", ")}</p>
          <p><strong>Total:</strong> ₹${booking.totalAmount}</p>
          <p><strong>Contact:</strong> ${booking.contact}</p>
          <p><strong>Address:</strong> ${booking.address}</p>
          <p><a href="${generateWhatsAppLink(
            booking.contact,
            booking
          )}" target="_blank">Send WhatsApp Confirmation</a></p>
        `,
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) console.log("Error sending email:", err);
        else console.log("Admin email sent:", info.response);
      });

      res.status(201).json(booking);
    } catch (err) {
      console.error("Booking creation error:", err);
      res.status(400).json({ message: err.message });
    }
  }
);

// PUT update booking
router.put("/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("cameras accessories");

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Generate WhatsApp link if status confirmed
    if (req.body.status === "Confirmed") {
      const waLink = generateWhatsAppLink(booking.contact, booking);
      console.log("WhatsApp link:", waLink);
      // Optional: send email to user including the WhatsApp link
    }

    res.json({ message: "Booking updated", booking });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE booking
router.delete("/:id", async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET WhatsApp link for a booking
router.get("/:id/wa-link", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate(
      "cameras accessories"
    );

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Calculate total
    const totalAmount =
      booking.cameras.reduce(
        (sum, c) => sum + (c.offerPrice || c.pricePerDay),
        0
      ) +
      booking.accessories.reduce(
        (sum, a) => sum + (a.offerPrice || a.pricePerDay),
        0
      );

    booking.totalAmount = totalAmount;
    booking.paymentLink = "https://yourpaymentlink.com/pay/12345";

    const waLink = generateWhatsAppLink(booking.contact, booking);
    res.json({ waLink });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
