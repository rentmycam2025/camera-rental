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
// POST create booking - Complete email version
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
        email,
        contact,
        address,
        emergencyContact,
        cameras,
        accessories,
        rentalPeriod,
      } = req.body;
      console.log("Body:", req.body);

      // Handle array fields properly
      const camerasArray = Array.isArray(cameras)
        ? cameras
        : cameras
        ? [cameras]
        : [];

      const accessoriesArray = Array.isArray(accessories)
        ? accessories
        : accessories
        ? [accessories]
        : [];

      console.log("Booking Details:", {
        fullName,
        email,
        contact,
        address,
        emergencyContact,
        cameras: camerasArray,
        accessories: accessoriesArray,
        rentalPeriod,
      });

      const booking = new Booking({
        fullName,
        email,
        contact,
        address,
        emergencyContact,
        rentalPeriod,
        cameras: camerasArray,
        accessories: accessoriesArray,
        idProof: req.files?.idProof
          ? {
              data: req.files.idProof[0].buffer,
              contentType: req.files.idProof[0].mimetype,
            }
          : undefined,
        userPhoto: req.files?.userPhoto
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
      const cameraTotal = booking.cameras.reduce(
        (sum, c) => sum + (c.offerPrice || c.pricePerDay || 0),
        0
      );

      const accessoryTotal = booking.accessories.reduce(
        (sum, a) => sum + (a.offerPrice || a.pricePerDay || 0),
        0
      );

      const totalAmount = cameraTotal + accessoryTotal;

      booking.totalAmount = totalAmount;
      await booking.save();

      // Generate WhatsApp link function
      const generateWhatsAppLink = (contact, booking) => {
        const message = `Hello ${
          booking.fullName
        }! Thank you for your booking with ${
          process.env.BRAND_NAME || "Our Company"
        }. Your booking for ${
          booking.rentalPeriod
        } has been received. We'll contact you shortly to confirm pickup details.`;
        const encodedMessage = encodeURIComponent(message);
        return `https://wa.me/91${contact}?text=${encodedMessage}`;
      };

      // Complete email template with all details
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL,
        subject: `📦 New Booking Received - ${booking.fullName}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 700px; margin: 0 auto; }
              .header { background: linear-gradient(135deg, #4F46E5, #7E22CE); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { padding: 30px; background: #f8fafc; }
              .section { background: white; padding: 25px; margin: 20px 0; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); border-left: 4px solid #4F46E5; }
              .section-title { color: #4F46E5; font-size: 20px; margin-bottom: 15px; font-weight: bold; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
              .detail-row { display: flex; margin: 8px 0; padding: 8px 0; border-bottom: 1px solid #f1f5f9; }
              .detail-label { font-weight: bold; color: #475569; min-width: 180px; }
              .detail-value { color: #1e293b; flex: 1; }
              .item-list { width: 100%; border-collapse: collapse; margin: 15px 0; }
              .item-list th { background: #4F46E5; color: white; padding: 12px; text-align: left; }
              .item-list td { padding: 12px; border-bottom: 1px solid #e2e8f0; }
              .item-list tr:nth-child(even) { background: #f8fafc; }
              .total-section { background: #dcfce7; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
              .total-amount { font-size: 28px; font-weight: bold; color: #166534; }
              .file-info { background: #fef3c7; padding: 8px 12px; border-radius: 6px; display: inline-block; margin: 5px 0; }
              .action-buttons { text-align: center; margin: 30px 0; }
              .whatsapp-btn { background: #25D366; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 10px; font-weight: bold; }
              .email-btn { background: #4F46E5; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 10px; font-weight: bold; }
              .footer { text-align: center; padding: 20px; color: #64748b; font-size: 14px; background: #f1f5f9; border-radius: 0 0 10px 10px; }
              .highlight { background: #f0f9ff; padding: 3px 6px; border-radius: 4px; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>🎉 New Booking Received!</h1>
              <p>Customer: <strong>${booking.fullName}</strong></p>
            </div>

            <div class="content">
              <!-- Customer Information Section -->
              <div class="section">
                <div class="section-title">👤 Customer Information</div>
                <div class="detail-row">
                  <div class="detail-label">Full Name:</div>
                  <div class="detail-value">${booking.fullName}</div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">Email Address:</div>
                  <div class="detail-value">
                    <a href="mailto:${
                      booking.email
                    }" style="color: #4F46E5; text-decoration: none;">
                      ${booking.email}
                    </a>
                  </div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">Contact Number:</div>
                  <div class="detail-value">
                    <a href="tel:${
                      booking.contact
                    }" style="color: #4F46E5; text-decoration: none;">
                      ${booking.contact}
                    </a>
                  </div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">Emergency Contact:</div>
                  <div class="detail-value">
                    ${
                      booking.emergencyContact ||
                      '<span style="color: #94a3b8;">Not provided</span>'
                    }
                  </div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">Address:</div>
                  <div class="detail-value">${booking.address}</div>
                </div>
              </div>

              <!-- Rental Details Section -->
              <div class="section">
                <div class="section-title">📅 Rental Details</div>
                <div class="detail-row">
                  <div class="detail-label">Rental Period:</div>
                  <div class="detail-value highlight">${
                    booking.rentalPeriod
                  }</div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">Booking Date:</div>
                  <div class="detail-value">${new Date(
                    booking.createdAt
                  ).toLocaleString()}</div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">Booking ID:</div>
                  <div class="detail-value">${booking._id}</div>
                </div>
              </div>

              <!-- Equipment Details Section -->
              <div class="section">
                <div class="section-title">📷 Equipment Details</div>
                
                <!-- Cameras Table -->
                <h3 style="color: #7E22CE; margin: 20px 0 10px 0;">Cameras (${
                  booking.cameras.length
                })</h3>
                ${
                  booking.cameras.length > 0
                    ? `
                    <table class="item-list">
                      <thead>
                        <tr>
                          <th>Camera Name</th>
                          <th>Daily Rate</th>
                          <th>Quantity</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${booking.cameras
                          .map(
                            (camera) => `
                          <tr>
                            <td><strong>${camera.name}</strong></td>
                            <td>₹${(
                              camera.offerPrice || camera.pricePerDay
                            ).toLocaleString()}/day</td>
                            <td>1</td>
                            <td><strong>₹${(
                              camera.offerPrice || camera.pricePerDay
                            ).toLocaleString()}</strong></td>
                          </tr>
                        `
                          )
                          .join("")}
                      </tbody>
                    </table>
                    `
                    : '<p style="color: #94a3b8; padding: 15px; text-align: center;">No cameras booked</p>'
                }

                <!-- Accessories Table -->
                <h3 style="color: #7E22CE; margin: 30px 0 10px 0;">Accessories (${
                  booking.accessories.length
                })</h3>
                ${
                  booking.accessories.length > 0
                    ? `
                    <table class="item-list">
                      <thead>
                        <tr>
                          <th>Accessory Name</th>
                          <th>Daily Rate</th>
                          <th>Quantity</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${booking.accessories
                          .map(
                            (accessory) => `
                          <tr>
                            <td><strong>${accessory.name}</strong></td>
                            <td>₹${(
                              accessory.offerPrice || accessory.pricePerDay
                            ).toLocaleString()}/day</td>
                            <td>1</td>
                            <td><strong>₹${(
                              accessory.offerPrice || accessory.pricePerDay
                            ).toLocaleString()}</strong></td>
                          </tr>
                        `
                          )
                          .join("")}
                      </tbody>
                    </table>
                    `
                    : '<p style="color: #94a3b8; padding: 15px; text-align: center;">No accessories booked</p>'
                }
              </div>

              <!-- Pricing Summary -->
              <div class="section">
                <div class="section-title">💰 Pricing Summary</div>
                <div class="detail-row">
                  <div class="detail-label">Cameras Subtotal:</div>
                  <div class="detail-value">₹${cameraTotal.toLocaleString()}/day</div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">Accessories Subtotal:</div>
                  <div class="detail-value">₹${accessoryTotal.toLocaleString()}/day</div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">Daily Total:</div>
                  <div class="detail-value"><strong>₹${(
                    cameraTotal + accessoryTotal
                  ).toLocaleString()}/day</strong></div>
                </div>
              </div>

              <!-- Final Total -->
              <div class="total-section">
                <h2 style="margin: 0 0 10px 0; color: #166534;">Final Total Amount</h2>
                <div class="total-amount">₹${totalAmount.toLocaleString()}</div>
                <p style="margin: 10px 0 0 0; color: #475569;">
                  For the entire rental period of ${booking.rentalPeriod}
                </p>
              </div>

              <!-- Documentation Section -->
              <div class="section">
                <div class="section-title">📄 Documentation</div>
                <div class="detail-row">
                  <div class="detail-label">ID Proof Uploaded:</div>
                  <div class="detail-value">
                    <span class="file-info">✅ ${
                      req.files?.idProof
                        ? req.files.idProof[0].originalname
                        : "Not uploaded"
                    }</span>
                  </div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">User Photo Uploaded:</div>
                  <div class="detail-value">
                    <span class="file-info">✅ ${
                      req.files?.userPhoto
                        ? req.files.userPhoto[0].originalname
                        : "Not uploaded"
                    }</span>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="action-buttons">
                <a href="${generateWhatsAppLink(
                  booking.contact,
                  booking
                )}" class="whatsapp-btn">
                  📱 Send WhatsApp Message
                </a>
                <a href="mailto:${booking.email}" class="email-btn">
                  ✉️ Send Email
                </a>
              </div>

              <!-- Next Steps -->
              <div class="section" style="background: #f0f9ff; border-left-color: #0ea5e9;">
                <div class="section-title" style="color: #0ea5e9;">🚀 Next Steps</div>
                <ol style="margin: 15px 0; padding-left: 20px;">
                  <li style="margin: 8px 0;">Contact customer to confirm booking details</li>
                  <li style="margin: 8px 0;">Verify equipment availability</li>
                  <li style="margin: 8px 0;">Schedule pickup/delivery time</li>
                  <li style="margin: 8px 0;">Process payment and documentation</li>
                </ol>
              </div>
            </div>

            <div class="footer">
              <p>This email was automatically generated by the Booking System</p>
              <p>© ${new Date().getFullYear()} ${
          process.env.BRAND_NAME || "Your Company Name"
        }. All rights reserved.</p>
            </div>
          </body>
          </html>
        `,
      };

      // Send email
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error("Error sending email:", err);
        } else {
          console.log("Admin email sent successfully:", info.response);
        }
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
