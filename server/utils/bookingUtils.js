// utils/bookingUtils.js
const calculateBookingTotal = (booking) => {
  const cameraTotal = booking.cameras.reduce(
    (sum, c) => sum + (c.offerPrice || c.pricePerDay || 0),
    0
  );

  const accessoryTotal = booking.accessories.reduce(
    (sum, a) => sum + (a.offerPrice || a.pricePerDay || 0),
    0
  );

  return {
    cameraTotal,
    accessoryTotal,
    totalAmount: cameraTotal + accessoryTotal,
  };
};

const handleArrayFields = (cameras, accessories) => {
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

  return { camerasArray, accessoriesArray };
};

const createBookingData = (reqBody, files) => {
  const {
    fullName,
    email,
    contact,
    address,
    emergencyContact,
    cameras,
    accessories,
    rentalPeriod,
  } = reqBody;

  const { camerasArray, accessoriesArray } = handleArrayFields(
    cameras,
    accessories
  );

  return {
    fullName,
    email,
    contact,
    address,
    emergencyContact,
    rentalPeriod,
    cameras: camerasArray,
    accessories: accessoriesArray,
    idProof: files?.idProof
      ? {
          data: files.idProof[0].buffer,
          contentType: files.idProof[0].mimetype,
        }
      : undefined,
    userPhoto: files?.userPhoto
      ? {
          data: files.userPhoto[0].buffer,
          contentType: files.userPhoto[0].mimetype,
        }
      : undefined,
  };
};

const generateDetailedWhatsAppMessage = (booking) => {
  const { totalAmount } = calculateBookingTotal(booking);

  let message = `Hello ${booking.fullName}, your booking is confirmed!\n\n`;
  message += `📅 Rental Period: ${booking.rentalPeriod}\n\n`;

  if (booking.cameras.length > 0) {
    message += `📷 Cameras:\n`;
    booking.cameras.forEach((camera) => {
      message += `• ${camera.name} - ₹${(
        camera.offerPrice || camera.pricePerDay
      ).toLocaleString()}/day\n`;
    });
    message += `\n`;
  }

  if (booking.accessories.length > 0) {
    message += `🔧 Accessories:\n`;
    booking.accessories.forEach((accessory) => {
      message += `• ${accessory.name} - ₹${(
        accessory.offerPrice || accessory.pricePerDay
      ).toLocaleString()}/day\n`;
    });
    message += `\n`;
  }

  message += `💰 Total Amount: ₹${totalAmount.toLocaleString()}\n\n`;
  message += `We'll contact you shortly to confirm pickup details. Thank you for choosing ${
    process.env.BRAND_NAME || "us"
  }!`;

  return message;
};

module.exports = {
  calculateBookingTotal,
  handleArrayFields,
  createBookingData,
  generateDetailedWhatsAppMessage,
};
