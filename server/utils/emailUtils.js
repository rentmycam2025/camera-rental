// utils/emailUtils.js

const {
  calculateBookingTotal,
  generateDetailedWhatsAppMessage,
} = require("./bookingUtils");

const generateWhatsAppLink = (contact, booking) => {
  const message = generateDetailedWhatsAppMessage(booking);
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/91${contact}?text=${encodedMessage}`;
};

const generateBookingEmailTemplate = (booking, files) => {
  const cameraTotal = booking.cameras.reduce(
    (sum, c) => sum + (c.offerPrice || c.pricePerDay || 0),
    0
  );
  const accessoryTotal = booking.accessories.reduce(
    (sum, a) => sum + (a.offerPrice || a.pricePerDay || 0),
    0
  );
  const totalAmount = cameraTotal + accessoryTotal;

  return {
    subject: `New Booking - ${booking.fullName}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; color: #333; line-height: 1.5; margin: 0; padding: 0; background: #f5f5f5; }
          .container { max-width: 700px; margin: 20px auto; background: #fff; border-radius: 8px; overflow: hidden; }
          .header { text-align: center; padding: 20px; border-bottom: 1px solid #ddd; }
          .header img { max-width: 150px; }
          .content { padding: 20px; }
          .section { margin-bottom: 20px; }
          .section-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; color: #111; }
          .detail-row { display: flex; margin: 6px 0; }
          .detail-label { width: 150px; font-weight: bold; color: #555; }
          .detail-value { flex: 1; color: #111; }
          .item-list { width: 100%; border-collapse: collapse; margin-top: 10px; }
          .item-list th, .item-list td { padding: 8px; border-bottom: 1px solid #eee; text-align: left; }
          .item-list th { background: #f9f9f9; font-weight: bold; }
          .total-section { padding: 15px; background: #fafafa; text-align: center; font-weight: bold; border-top: 1px solid #ddd; }
          .action-buttons { text-align: center; margin: 20px 0; }
          .action-buttons a { display: inline-block; padding: 10px 20px; margin: 5px; text-decoration: none; color: #fff; border-radius: 5px; font-weight: bold; }
          .whatsapp-btn { background: #25D366; }
          .email-btn { background: #4F46E5; }
          .image-container { margin: 10px 0; text-align: center; }
          .document-image { max-width: 100%; max-height: 300px; border: 1px solid #ccc; border-radius: 5px; }
          .footer { font-size: 12px; color: #777; text-align: center; padding: 15px; border-top: 1px solid #ddd; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://res.cloudinary.com/dhqhk1k3t/image/upload/v1760359478/logo_dark_d7ik7y.png" alt="Logo">
          </div>

          <div class="content">

            <!-- Customer Information -->
            <div class="section">
              <div class="section-title">Customer Information</div>
              <div class="detail-row"><div class="detail-label">Full Name:</div><div class="detail-value">${
                booking.fullName
              }</div></div>
              <div class="detail-row"><div class="detail-label">Email:</div><div class="detail-value"><a href="mailto:${
                booking.email
              }">${booking.email}</a></div></div>
              <div class="detail-row"><div class="detail-label">Contact:</div><div class="detail-value"><a href="tel:${
                booking.contact
              }">${booking.contact}</a></div></div>
              <div class="detail-row"><div class="detail-label">Emergency Contact:</div><div class="detail-value">${
                booking.emergencyContact || "Not provided"
              }</div></div>
              <div class="detail-row"><div class="detail-label">Address:</div><div class="detail-value">${
                booking.address
              }</div></div>
            </div>

            <!-- Documents -->
            <div class="section">
              <div class="section-title">Documentation</div>
              <div class="detail-row">
                <div class="detail-label">ID Proof:</div>
                <div class="detail-value">
                  ${
                    files?.idProof
                      ? `<div class="image-container"><p>${files.idProof[0].originalname}</p><img src="cid:idProofImage" class="document-image" /></div>`
                      : "Not uploaded"
                  }
                </div>
              </div>
              <div class="detail-row">
                <div class="detail-label">User Photo:</div>
                <div class="detail-value">
                  ${
                    files?.userPhoto
                      ? `<div class="image-container"><p>${files.userPhoto[0].originalname}</p><img src="cid:userPhotoImage" class="document-image" /></div>`
                      : "Not uploaded"
                  }
                </div>
              </div>
            </div>

            <!-- Rental Details -->
            <div class="section">
              <div class="section-title">Rental Details</div>
              <div class="detail-row"><div class="detail-label">Rental Period:</div><div class="detail-value">${
                booking.rentalPeriod
              }</div></div>
              <div class="detail-row"><div class="detail-label">Booking Date:</div><div class="detail-value">${new Date(
                booking.createdAt
              ).toLocaleString()}</div></div>
              <div class="detail-row"><div class="detail-label">Booking ID:</div><div class="detail-value">${
                booking._id
              }</div></div>
            </div>

            <!-- Equipment Details -->
            <div class="section">
              <div class="section-title">Equipment Details</div>
              <p>Cameras (${booking.cameras.length})</p>
              ${
                booking.cameras.length > 0
                  ? `<table class="item-list">
                      <thead><tr><th>Name</th><th>Rate</th><th>Qty</th><th>Total</th></tr></thead>
                      <tbody>
                        ${booking.cameras
                          .map(
                            (c) => `<tr>
                          <td>${c.name}</td>
                          <td>₹${(
                            c.offerPrice || c.pricePerDay
                          ).toLocaleString()}</td>
                          <td>1</td>
                          <td>₹${(
                            c.offerPrice || c.pricePerDay
                          ).toLocaleString()}</td>
                        </tr>`
                          )
                          .join("")}
                      </tbody>
                    </table>`
                  : `<p>No cameras booked</p>`
              }
              <p>Accessories (${booking.accessories.length})</p>
              ${
                booking.accessories.length > 0
                  ? `<table class="item-list">
                      <thead><tr><th>Name</th><th>Rate</th><th>Qty</th><th>Total</th></tr></thead>
                      <tbody>
                        ${booking.accessories
                          .map(
                            (a) => `<tr>
                          <td>${a.name}</td>
                          <td>₹${(
                            a.offerPrice || a.pricePerDay
                          ).toLocaleString()}</td>
                          <td>1</td>
                          <td>₹${(
                            a.offerPrice || a.pricePerDay
                          ).toLocaleString()}</td>
                        </tr>`
                          )
                          .join("")}
                      </tbody>
                    </table>`
                  : `<p>No accessories booked</p>`
              }
            </div>

            <!-- Total -->
            <div class="total-section">
              Final Total: ₹${totalAmount.toLocaleString()}<br/>
              Rental Period: ${booking.rentalPeriod}
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons">
              <a href="${generateWhatsAppLink(
                booking.contact,
                booking
              )}" class="whatsapp-btn">Send WhatsApp</a>
              <a href="mailto:${booking.email}" class="email-btn">Send Email</a>
            </div>
          </div>

          <div class="footer">
            © ${new Date().getFullYear()} ${
      process.env.BRAND_NAME || "Your Company"
    }. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `,
  };
};

const prepareEmailAttachments = (files) => {
  const attachments = [];

  if (files?.idProof) {
    attachments.push({
      filename: files.idProof[0].originalname,
      content: files.idProof[0].buffer,
      contentType: files.idProof[0].mimetype,
      cid: "idProofImage",
    });
  }

  if (files?.userPhoto) {
    attachments.push({
      filename: files.userPhoto[0].originalname,
      content: files.userPhoto[0].buffer,
      contentType: files.userPhoto[0].mimetype,
      cid: "userPhotoImage",
    });
  }

  return attachments;
};

const sendBookingEmail = async (transporter, booking, files) => {
  try {
    const emailTemplate = generateBookingEmailTemplate(booking, files);
    const attachments = prepareEmailAttachments(files);

    const mailOptions = {
      from: `"${process.env.BRAND_NAME || "Rent My Cam"}" <${
        process.env.EMAIL_USER
      }>`,
      to: process.env.ADMIN_EMAIL,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      attachments: attachments,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Admin email sent successfully:", info.response);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

// Customer confirmation email with similar design
const sendCustomerConfirmationEmail = async (transporter, booking) => {
  try {
    const { totalAmount } = calculateBookingTotal(booking);

    const mailOptions = {
      from: `"${process.env.BRAND_NAME || "Rent My Cam"}" <${
        process.env.EMAIL_USER
      }>`,
      to: booking.email,
      subject: `Booking Confirmation - ${
        process.env.BRAND_NAME || "Our Company"
      }`,
      html: `<!DOCTYPE html>
                <html lang="en">
                <head>
                <meta charset="UTF-8">
                <title>Booking Confirmation</title>
                <style>
                    body {
                    margin: 0;
                    padding: 0;
                    font-family: 'Inter', Arial, sans-serif;
                    background-color: #f9fafb;
                    color: #1f2937;
                    line-height: 1.5;
                    }
                    .container {
                    max-width: 680px;
                    margin: 40px auto;
                    background: #ffffff;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 6px 18px rgba(0,0,0,0.06);
                    }
                    .header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 25px 35px;
                    border-bottom: 4px solid #F97316;
                    background: #ffffff;
                    }
                    .header img {
                    max-width: 140px;
                    }
                    .header h2 {
                    font-size: 24px;
                    font-weight: 700;
                    color: #F97316;
                    margin: 0;
                    }
                    .content {
                    padding: 35px 40px;
                    }
                    .greeting {
                    font-size: 16px;
                    font-weight: 500;
                    margin-bottom: 12px;
                    }
                    .intro {
                    font-size: 15px;
                    color: #4b5563;
                    margin-bottom: 25px;
                    }
                    .section-title {
                    font-size: 18px;
                    font-weight: 600;
                    color: #F97316;
                    border-bottom: 1px solid #f3f4f6;
                    padding-bottom: 8px;
                    margin-bottom: 20px;
                    }
                    .card {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: #ffffff;
                    border-radius: 8px;
                    padding: 15px 20px;
                    margin-bottom: 12px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
                    }
                    .card .item-label {
                    display: flex;
                    align-items: center;
                    font-size: 15px;
                    color: #4b5563;
                    }
                    .card .item-label svg {
                    margin-right: 10px;
                    fill: #F97316;
                    }
                    .card .item-value {
                    font-weight: 600;
                    font-size: 15px;
                    color: #F97316;
                    }
                    .total {
                    text-align: right;
                    font-size: 20px;
                    font-weight: 700;
                    color: #F97316;
                    margin-top: 25px;
                    }
                    .note {
                    font-size: 14px;
                    color: #4b5563;
                    margin-top: 25px;
                    padding-top: 15px;
                    border-top: 1px solid #f3f4f6;
                    }
                    .footer {
                    font-size: 12px;
                    color: #9ca3af;
                    text-align: center;
                    padding: 15px 0;
                    background: #f9fafb;
                    border-top: 1px solid #f3f4f6;
                    }

                    @media only screen and (max-width: 600px) {
                    .container {
                        margin: 0;
                        border-radius: 0;
                        box-shadow: none;
                    }
                    .content {
                        padding: 20px 25px;
                    }
                    .header {
                        flex-direction: column;
                        text-align: center;
                    }
                    .header h2 {
                        margin-top: 12px;
                        font-size: 22px;
                    }
                    }
                </style>
                </head>
                <body>
                <div class="container">

                    <!-- Header -->
                    <div class="header">
                    <img src="https://res.cloudinary.com/dhqhk1k3t/image/upload/v1760359478/logo_dark_d7ik7y.png" alt="Logo">
                    <h2>Booking Confirmed</h2>
                    </div>

                    <!-- Content -->
                    <div class="content">
                    <div class="greeting">Hello <strong>${
                      booking.fullName
                    }</strong>,</div>
                    <p class="intro">Your booking has been successfully confirmed. Here are the details:</p>

                    <div class="section-title">Order Details</div>

                    <!-- Rental Period Card -->
                    <div class="card">
                        <div class="item-label">
                        <svg width="16" height="16" viewBox="0 0 24 24">
                            <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zm0 16H5V9h14v11zm0-13H5V6h14v1z"/>
                        </svg>
                        Rental Period
                        </div>
                        <div class="item-value">${booking.rentalPeriod}</div>
                    </div>

                    <!-- Cameras Card -->
                    <div class="card">
                        <div class="item-label">
                        <svg width="16" height="16" viewBox="0 0 24 24">
                            <path d="M12 5c-3.859 0-7 3.141-7 7s3.141 7 7 7 7-3.141 7-7-3.141-7-7-7zm0 12c-2.757 0-5-2.243-5-5s2.243-5 5-5 5 2.243 5 5-2.243 5-5 5zm10-12h-3.586l-1.707-1.707A.996.996 0 0 0 16 3h-8c-.265 0-.52.105-.707.293L5.586 5H2c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h20c1.103 0 2-.897 2-2V7c0-1.103-.897-2-2-2z"/>
                        </svg>
                        Cameras
                        </div>
                        <div class="item-value">${
                          booking.cameras.length
                        } items</div>
                    </div>

                    <!-- Accessories Card -->
                    <div class="card">
                        <div class="item-label">
                        <svg width="16" height="16" viewBox="0 0 24 24">
                            <path d="M19.43 12.98c.04-.32.07-.65.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1a6.967 6.967 0 0 0-1.7-.98l-.38-2.65A.495.495 0 0 0 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.63.24-1.21.57-1.7.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.5.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.5.41 1.07.74 1.7.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.63-.24 1.21-.57 1.7-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.5-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5S10.07 8.5 12 8.5s3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
                        </svg>
                        Accessories
                        </div>
                        <div class="item-value">${
                          booking.accessories.length
                        } items</div>
                    </div>

                    <!-- Total -->
                    <p class="total">Total Amount: <strong>₹${totalAmount.toLocaleString()}</strong></p>

                    <!-- Note -->
                    <p class="note">We will contact you shortly to finalize pickup or delivery. Thank you for choosing <strong>${
                      process.env.BRAND_NAME || "Your Company"
                    }</strong>.</p>
                    </div>

                    <!-- Footer -->
                    <div class="footer">© ${new Date().getFullYear()} ${
        process.env.BRAND_NAME || "Your Company"
      }. All rights reserved.</div>

                </div>
                </body>
                </html>
                `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Customer confirmation email sent successfully");
    return true;
  } catch (error) {
    console.error("Error sending customer email:", error);
    throw error;
  }
};

module.exports = {
  generateBookingEmailTemplate,
  generateWhatsAppLink,
  prepareEmailAttachments,
  sendBookingEmail,
  sendCustomerConfirmationEmail,
};
