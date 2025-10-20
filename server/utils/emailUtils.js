// utils/emailUtils.js
require("dotenv").config();
// const SibApiV3Sdk = require("sib-api-v3-sdk");
const nodemailer = require("nodemailer");

const {
  calculateBookingTotal,
  generateDetailedWhatsAppMessage,
} = require("./bookingUtils");

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true, // true for 465
  auth: {
    user: process.env.EMAIL_USER, // hello@rentmycam.in
    pass: process.env.EMAIL_PASSWORD, // email password or app password
  },
});
// Initialize Brevo API client
// const defaultClient = SibApiV3Sdk.ApiClient.instance;
// const apiKey = defaultClient.authentications["api-key"];
// apiKey.apiKey = process.env.BREVO_API_KEY;
// const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

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
      name: files.idProof[0].originalname,
      content: files.idProof[0].buffer.toString("base64"),
      contentId: "idProofImage", // CID for inline image reference
    });
  }

  if (files?.userPhoto) {
    attachments.push({
      name: files.userPhoto[0].originalname,
      content: files.userPhoto[0].buffer.toString("base64"),
      contentId: "userPhotoImage", // CID for inline image reference
    });
  }

  return attachments;
};

// const sendBookingEmail = async (booking, files) => {
//   try {
//     const emailTemplate = generateBookingEmailTemplate(booking, files);
//     const attachments = prepareEmailAttachments(files);

//     const sendSmtpEmail = {
//       sender: {
//         name: process.env.BRAND_NAME || "Rent My Cam",
//         email: process.env.EMAIL_USER,
//       },
//       to: [
//         {
//           email: process.env.ADMIN_EMAIL,
//           name: "Admin",
//         },
//       ],
//       subject: emailTemplate.subject,
//       htmlContent: emailTemplate.html,
//       attachment: attachments,
//     };

//     const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
//     console.log("Admin email sent successfully via Brevo:", data);
//     return true;
//   } catch (error) {
//     console.error("Error sending email via Brevo:", error);
//     throw error;
//   }
// };

const sendBookingEmail = async (booking, files) => {
  try {
    const emailTemplate = generateBookingEmailTemplate(booking, files);
    const attachments = prepareEmailAttachments(files);

    const info = await transporter.sendMail({
      from: `"${process.env.BRAND_NAME || "Rent My Cam"}" <${
        process.env.EMAIL_USER
      }>`,
      to: process.env.ADMIN_EMAIL,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      attachments: attachments.map((a) => ({
        filename: a.name,
        content: Buffer.from(a.content, "base64"),
        cid: a.contentId,
      })),
    });

    console.log("Admin email sent successfully via Hostinger:", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email via Hostinger SMTP:", error);
    throw error;
  }
};

// Customer confirmation email with similar design
// const sendCustomerConfirmationEmail = async (booking) => {
//   try {
//     const { totalAmount } = calculateBookingTotal(booking);

//     const simpleEmailHtml = `<!DOCTYPE html>
//                               <html lang="en">
//                               <head>
//                                   <meta charset="UTF-8">
//                                   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//                                   <title>Booking Confirmation</title>
//                                   <style>
//                                       /* Reset */
//                                       * {
//                                           margin: 0;
//                                           padding: 0;
//                                           box-sizing: border-box;
//                                       }

//                                       body {
//                                           margin: 0;
//                                           padding: 0;
//                                           font-family: 'Inter', Arial, sans-serif;
//                                           background-color: #f5f5f5;
//                                           color: #1f2937;
//                                           line-height: 1.5;
//                                           -webkit-text-size-adjust: 100%;
//                                           -ms-text-size-adjust: 100%;
//                                       }

//                                       /* Container */
//                                       .container {
//                                           max-width: 600px;
//                                           margin: 0 auto;
//                                           background: #ffffff;
//                                           border-radius: 12px;
//                                           overflow: hidden;
//                                           padding: 40px 30px;
//                                           box-shadow: 0 4px 20px rgba(0,0,0,0.05);
//                                           text-align: center;
//                                       }

//                                       /* Logo */
//                                       .logo {
//                                           max-width: 120px;
//                                           margin-bottom: 25px;
//                                           display: block;
//                                           margin-left: auto;
//                                           margin-right: auto;
//                                       }

//                                       /* Typography */
//                                       h2 {
//                                           color: #F97316;
//                                           font-size: 26px;
//                                           font-weight: 700;
//                                           margin-bottom: 15px;
//                                       }

//                                       p {
//                                           font-size: 16px;
//                                           color: #374151;
//                                           margin-bottom: 15px;
//                                       }

//                                       .highlight {
//                                           font-weight: 600;
//                                           color: #F97316;
//                                       }

//                                       /* Contact Section */
//                                       .contact {
//                                           display: flex;
//                                           justify-content: center;
//                                           gap: 20px;
//                                           margin: 25px 0;
//                                           flex-wrap: wrap;
//                                       }

//                                       .contact-item {
//                                           display: flex;
//                                           align-items: center;
//                                           gap: 10px;
//                                           padding: 12px 20px;
//                                           border-radius: 8px;
//                                           background-color: #F9FAFB;
//                                           text-decoration: none;
//                                           color: #1f2937;
//                                           font-weight: 500;
//                                           transition: all 0.2s ease-in-out;
//                                           min-width: 140px;
//                                           justify-content: center;
//                                       }

//                                       .contact-item img {
//                                           width: 24px;
//                                           height: 24px;
//                                       }

//                                       .contact-item:hover {
//                                           background-color: #F97316;
//                                           color: #ffffff;
//                                       }

//                                       .contact-item:hover img {
//                                           filter: brightness(0) invert(1);
//                                       }

//                                       /* Footer */
//                                       .footer {
//                                           font-size: 12px;
//                                           color: #9ca3af;
//                                           margin-top: 30px;
//                                       }

//                                       /* Price Box */
//                                       .price-box {
//                                           background-color: #FFF7ED;
//                                           border-radius: 8px;
//                                           padding: 15px;
//                                           margin: 20px 0;
//                                           border-left: 4px solid #F97316;
//                                       }

//                                       .price-amount {
//                                           font-size: 22px;
//                                           font-weight: 700;
//                                           color: #F97316;
//                                       }

//                                       /* Divider */
//                                       .divider {
//                                           height: 1px;
//                                           background-color: #E5E7EB;
//                                           margin: 25px 0;
//                                       }

//                                       /* Responsive */
//                                       @media only screen and (max-width: 480px) {
//                                           .container {
//                                               padding: 25px 20px;
//                                               margin: 10px;
//                                               border-radius: 8px;
//                                           }

//                                           h2 {
//                                               font-size: 22px;
//                                           }

//                                           p, .contact-item {
//                                               font-size: 15px;
//                                           }

//                                           .contact {
//                                               flex-direction: column;
//                                               align-items: center;
//                                               gap: 12px;
//                                           }

//                                           .contact-item {
//                                               width: 100%;
//                                               max-width: 220px;
//                                           }

//                                           .price-amount {
//                                               font-size: 20px;
//                                           }
//                                       }

//                                       /* For email clients that don't support media queries */
//                                       @media only screen and (max-width: 480px) {
//                                           table.container {
//                                               width: 100% !important;
//                                           }
//                                       }
//                                   </style>
//                               </head>
//                               <body>
//                                   <div class="container">
//                                       <img class="logo" src="https://res.cloudinary.com/dhqhk1k3t/image/upload/v1760359478/logo_dark_d7ik7y.png" alt="Logo">
//                                       <h2>Booking Confirmed!</h2>
//                                       <p>Hello <span class="highlight">${
//                                         booking.fullName
//                                       }</span>,</p>
//                                       <p>Your rental booking has been successfully confirmed.</p>
//                                       <p>Our team will call or message you within a few hours to finalize the next steps.</p>

//                                       <div class="price-box">
//                                           <p>Total Rental Price</p>
//                                           <div class="price-amount">₹${totalAmount.toLocaleString()}</div>
//                                       </div>

//                                       <!-- Contact Section -->
//                                       <div class="contact">
//                                           <!-- Call Us -->
//                                           <a href="tel:${
//                                             process.env.CONTACT_NUMBER
//                                           }" class="contact-item">
//                                               <img src="https://img.icons8.com/?size=100&id=I24lanX6Nq71&format=png&color=000000" alt="Phone Icon">
//                                               Call Us
//                                           </a>

//                                           <!-- WhatsApp Us -->
//                                           <a href="https://wa.me/${
//                                             process.env.WHATSAPP_NUMBER
//                                           }" class="contact-item">
//                                               <img src="https://img.icons8.com/?size=100&id=16713&format=png&color=000000" alt="WhatsApp Icon">
//                                               WhatsApp Us
//                                           </a>
//                                       </div>

//                                       <div class="divider"></div>

//                                       <p>Thank you for choosing <span class="highlight">${
//                                         process.env.BRAND_NAME || "Your Company"
//                                       }</span>!</p>
//                                       <div class="footer">© ${new Date().getFullYear()} ${
//       process.env.BRAND_NAME || "Your Company"
//     }. All rights reserved.</div>
//                                   </div>
//                               </body>
//                               </html>`;

//     const sendSmtpEmail = {
//       sender: {
//         name: process.env.BRAND_NAME || "Rent My Cam",
//         email: process.env.EMAIL_USER,
//       },
//       to: [
//         {
//           email: booking.email,
//           name: booking.fullName,
//         },
//       ],
//       subject: `Booking Confirmation - ${
//         process.env.BRAND_NAME || "Our Company"
//       }`,
//       htmlContent: simpleEmailHtml,
//     };

//     const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
//     console.log(
//       "Customer confirmation email sent successfully via Brevo:",
//       data
//     );
//     return true;
//   } catch (error) {
//     console.error("Error sending customer email via Brevo:", error);
//     throw error;
//   }
// };

const sendCustomerConfirmationEmail = async (booking) => {
  try {
    const { totalAmount } = calculateBookingTotal(booking);
    const simpleEmailHtml = `<!DOCTYPE html>
                              <html lang="en">
                              <head>
                                  <meta charset="UTF-8">
                                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                  <title>Booking Confirmation</title>
                                  <style>
                                      /* Reset */
                                      * {
                                          margin: 0;
                                          padding: 0;
                                          box-sizing: border-box;
                                      }
                                      
                                      body {
                                          margin: 0;
                                          padding: 0;
                                          font-family: 'Inter', Arial, sans-serif;
                                          background-color: #f5f5f5;
                                          color: #1f2937;
                                          line-height: 1.5;
                                          -webkit-text-size-adjust: 100%;
                                          -ms-text-size-adjust: 100%;
                                      }
                                      
                                      /* Container */
                                      .container {
                                          max-width: 600px;
                                          margin: 0 auto;
                                          background: #ffffff;
                                          border-radius: 12px;
                                          overflow: hidden;
                                          padding: 40px 30px;
                                          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
                                          text-align: center;
                                      }
                                      
                                      /* Logo */
                                      .logo {
                                          max-width: 120px;
                                          margin-bottom: 25px;
                                          display: block;
                                          margin-left: auto;
                                          margin-right: auto;
                                      }
                                      
                                      /* Typography */
                                      h2 {
                                          color: #F97316;
                                          font-size: 26px;
                                          font-weight: 700;
                                          margin-bottom: 15px;
                                      }
                                      
                                      p {
                                          font-size: 16px;
                                          color: #374151;
                                          margin-bottom: 15px;
                                      }
                                      
                                      .highlight {
                                          font-weight: 600;
                                          color: #F97316;
                                      }
                                      
                                      /* Contact Section */
                                      .contact {
                                          display: flex;
                                          justify-content: center;
                                          gap: 20px;
                                          margin: 25px 0;
                                          flex-wrap: wrap;
                                      }
                                      
                                      .contact-item {
                                          display: flex;
                                          align-items: center;
                                          gap: 10px;
                                          padding: 12px 20px;
                                          border-radius: 8px;
                                          background-color: #F9FAFB;
                                          text-decoration: none;
                                          color: #1f2937;
                                          font-weight: 500;
                                          transition: all 0.2s ease-in-out;
                                          min-width: 140px;
                                          justify-content: center;
                                      }
                                      
                                      .contact-item img {
                                          width: 24px;
                                          height: 24px;
                                      }
                                      
                                      .contact-item:hover {
                                          background-color: #F97316;
                                          color: #ffffff;
                                      }
                                      
                                      .contact-item:hover img {
                                          filter: brightness(0) invert(1);
                                      }
                                      
                                      /* Footer */
                                      .footer {
                                          font-size: 12px;
                                          color: #9ca3af;
                                          margin-top: 30px;
                                      }
                                      
                                      /* Price Box */
                                      .price-box {
                                          background-color: #FFF7ED;
                                          border-radius: 8px;
                                          padding: 15px;
                                          margin: 20px 0;
                                          border-left: 4px solid #F97316;
                                      }
                                      
                                      .price-amount {
                                          font-size: 22px;
                                          font-weight: 700;
                                          color: #F97316;
                                      }
                                      
                                      /* Divider */
                                      .divider {
                                          height: 1px;
                                          background-color: #E5E7EB;
                                          margin: 25px 0;
                                      }
                                      
                                      /* Responsive */
                                      @media only screen and (max-width: 480px) {
                                          .container {
                                              padding: 25px 20px;
                                              margin: 10px;
                                              border-radius: 8px;
                                          }
                                          
                                          h2 {
                                              font-size: 22px;
                                          }
                                          
                                          p, .contact-item {
                                              font-size: 15px;
                                          }
                                          
                                          .contact {
                                              flex-direction: column;
                                              align-items: center;
                                              gap: 12px;
                                          }
                                          
                                          .contact-item {
                                              width: 100%;
                                              max-width: 220px;
                                          }
                                          
                                          .price-amount {
                                              font-size: 20px;
                                          }
                                      }
                                      
                                      /* For email clients that don't support media queries */
                                      @media only screen and (max-width: 480px) {
                                          table.container {
                                              width: 100% !important;
                                          }
                                      }
                                  </style>
                              </head>
                              <body>
                                  <div class="container">
                                      <img class="logo" src="https://res.cloudinary.com/dhqhk1k3t/image/upload/v1760359478/logo_dark_d7ik7y.png" alt="Logo">
                                      <h2>Booking Confirmed!</h2>
                                      <p>Hello <span class="highlight">${
                                        booking.fullName
                                      }</span>,</p>
                                      <p>Your rental booking has been successfully confirmed.</p>
                                      <p>Our team will call or message you within a few hours to finalize the next steps.</p>
                                      
                                      <div class="price-box">
                                          <p>Total Rental Price</p>
                                          <div class="price-amount">₹${totalAmount.toLocaleString()}</div>
                                      </div>
                                      
                                      <!-- Contact Section -->
                                      <div class="contact">
                                          <!-- Call Us -->
                                          <a href="tel:${
                                            process.env.CONTACT_NUMBER
                                          }" class="contact-item">
                                              <img src="https://img.icons8.com/?size=100&id=I24lanX6Nq71&format=png&color=000000" alt="Phone Icon">
                                              Call Us
                                          </a>

                                          <!-- WhatsApp Us -->
                                          <a href="https://wa.me/${
                                            process.env.WHATSAPP_NUMBER
                                          }" class="contact-item">
                                              <img src="https://img.icons8.com/?size=100&id=16713&format=png&color=000000" alt="WhatsApp Icon">
                                              WhatsApp Us
                                          </a>
                                      </div>
                                      
                                      <div class="divider"></div>
                                      
                                      <p>Thank you for choosing <span class="highlight">${
                                        process.env.BRAND_NAME || "Your Company"
                                      }</span>!</p>
                                      <div class="footer">© ${new Date().getFullYear()} ${
      process.env.BRAND_NAME || "Your Company"
    }. All rights reserved.</div>
                                  </div>
                              </body>
                              </html>`;

    const info = await transporter.sendMail({
      from: `"${process.env.BRAND_NAME || "Rent My Cam"}" <${
        process.env.EMAIL_USER
      }>`,
      to: booking.email,
      subject: `Booking Confirmation - ${
        process.env.BRAND_NAME || "Our Company"
      }`,
      html: simpleEmailHtml,
    });

    console.log(
      "Customer email sent successfully via Hostinger:",
      info.messageId
    );
    return true;
  } catch (error) {
    console.error("Error sending customer email via Hostinger:", error);
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
