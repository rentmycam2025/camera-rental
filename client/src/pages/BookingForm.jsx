import React, { useState, useEffect, Suspense, lazy } from "react";
import { useNavigate } from "react-router-dom";

import { createBooking } from "../api";
import { BRAND_CONFIG } from "../config/constants";

// Lazy loaded components
const Step1Form = lazy(() => {
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          default: React.memo(
            ({
              form,
              formErrors,
              rentalDates,
              numberOfDays,
              handleChange,
              handlePhoneChange,
              handleFileChange,
              handleNext,
            }) => (
              <div className="space-y-4 transition duration-500">
                <h3 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">
                  1. Your Contact & Documentation
                </h3>

                <div>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name (Required)"
                    value={form.fullName}
                    onChange={handleChange}
                    className={`border p-3 w-full rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:ring-primary-500 focus:border-primary-500 transition ${
                      formErrors.fullName ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  />
                  {formErrors.fullName && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address (Required)"
                    value={form.email}
                    onChange={handleChange}
                    className={`border p-3 w-full rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:ring-primary-500 focus:border-primary-500 transition ${
                      formErrors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="tel"
                    name="contact"
                    placeholder="Contact Number (10 digits)"
                    value={form.contact}
                    onChange={handlePhoneChange}
                    maxLength="10"
                    className={`border p-3 w-full rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:ring-primary-500 focus:border-primary-500 transition ${
                      formErrors.contact ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  />
                  {formErrors.contact && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.contact}
                    </p>
                  )}
                </div>

                <div>
                  <textarea
                    name="address"
                    placeholder="Billing & Pickup Address (Required)"
                    value={form.address}
                    onChange={handleChange}
                    rows="3"
                    className={`border p-3 w-full rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:ring-primary-500 focus:border-primary-500 transition ${
                      formErrors.address ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  />
                  {formErrors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.address}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="tel"
                    name="emergencyContact"
                    placeholder="Emergency Contact (10 digits)"
                    value={form.emergencyContact}
                    onChange={handlePhoneChange}
                    maxLength="10"
                    className={`border p-3 w-full rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:ring-primary-500 focus:border-primary-500 transition ${
                      formErrors.emergencyContact
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    required
                  />
                  {formErrors.emergencyContact && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.emergencyContact}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label
                      htmlFor="idProof"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      ID Proof (Required) - JPG, PNG
                    </label>
                    <input
                      type="file"
                      id="idProof"
                      name="idProof"
                      accept=".jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className={`w-full border p-3 rounded-lg bg-gray-50 text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-100 file:text-primary-700 hover:file:bg-primary-200 ${
                        formErrors.idProof
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      required
                    />
                    {formErrors.idProof ? (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.idProof}
                      </p>
                    ) : form.idProof ? (
                      <p className="text-accent-success text-sm mt-1">
                        File Selected: {form.idProof.name}
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <label
                      htmlFor="userPhoto"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      User Photo (Required) - JPG, PNG
                    </label>
                    <input
                      type="file"
                      id="userPhoto"
                      name="userPhoto"
                      accept="image/*"
                      onChange={handleFileChange}
                      className={`w-full border p-3 rounded-lg bg-gray-50 text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-100 file:text-primary-700 hover:file:bg-primary-200 ${
                        formErrors.userPhoto
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      required
                    />
                    {formErrors.userPhoto ? (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.userPhoto}
                      </p>
                    ) : form.userPhoto ? (
                      <p className="text-accent-success text-sm mt-1">
                        File Selected: {form.userPhoto.name}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="p-3 bg-primary-50 border border-primary-300 rounded-lg text-gray-800">
                  <p className="font-semibold">
                    Rental Period:{" "}
                    <span className="text-primary-600 font-bold">
                      {rentalDates.start} to {rentalDates.end}
                    </span>
                  </p>
                  <p className="font-semibold">
                    Total Days:{" "}
                    <span className="text-primary-600 font-bold">
                      {numberOfDays}
                    </span>
                  </p>
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="bg-primary-500 text-white font-bold px-6 py-3 rounded-xl w-full shadow-lg shadow-primary-300 hover:bg-primary-600 transition duration-300 transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next: Review Order
                  </button>
                </div>
              </div>
            )
          ),
        }),
      100
    );
  });
});

const Step2Review = lazy(() => {
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          default: React.memo(
            ({
              cart,
              cartItemCount,
              form,
              rentalDates,
              numberOfDays,
              subtotal,
              finalTotalCost,
              isSubmitting,
              handleBack,
              handleSubmit,
            }) => (
              <div className="space-y-6 transition duration-500">
                <h3 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">
                  2. Review & Confirm Order
                </h3>

                <div className="p-4 bg-primary-50 rounded-xl border border-primary-300">
                  <h4 className="font-bold text-xl mb-3 text-gray-700">
                    Rental Items: ({cartItemCount} total)
                  </h4>
                  <ul className="space-y-2 max-h-40 overflow-y-auto">
                    {cart.map((item) => (
                      <li
                        key={item._id}
                        className="flex justify-between text-gray-800 text-sm border-b border-primary-200 pb-1"
                      >
                        <span className="flex-1">
                          {item.name}
                          <span className="text-xs text-gray-500 ml-2">
                            ({item.category || "no category"})
                          </span>
                        </span>
                        <span className="font-medium text-right">
                          x {item.quantity} (@ ₹
                          {(
                            item.offerPrice || item.pricePerDay
                          ).toLocaleString()}
                          /day)
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-gray-700">
                  <h4 className="font-bold text-xl mb-3 text-gray-900">
                    Your Contact Info:
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Name:</strong> {form.fullName}
                    </p>
                    <p>
                      <strong>Email:</strong> {form.email}
                    </p>
                    <p>
                      <strong>Contact:</strong> {form.contact}
                    </p>
                    <p>
                      <strong>Address:</strong> {form.address}
                    </p>
                    <p>
                      <strong>Emergency Contact:</strong>{" "}
                      {form.emergencyContact}
                    </p>
                    <p>
                      <strong>Rental Period:</strong>{" "}
                      <span className="font-medium text-primary-600">
                        {rentalDates.start} to {rentalDates.end} ({numberOfDays}{" "}
                        days)
                      </span>
                    </p>
                    <p>
                      <strong>ID Proof Submitted:</strong>{" "}
                      <span className="text-accent-success">
                        {form.idProof ? `Yes (${form.idProof.name})` : "No"}
                      </span>
                    </p>
                    <p>
                      <strong>Photo Submitted:</strong>{" "}
                      <span className="text-accent-success">
                        {form.userPhoto ? `Yes (${form.userPhoto.name})` : "No"}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-accent-success/10 text-gray-700 rounded-xl border border-accent-success">
                  <h4 className="font-bold text-xl mb-3 text-gray-900">
                    Pricing Breakdown:
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Daily Rental Cost:</span>
                      <span>₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Number of Days:</span>
                      <span>{numberOfDays}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>Final Total Cost:</span>
                      <span className="text-accent-success">
                        ₹{finalTotalCost.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="bg-gray-300 text-gray-800 font-bold px-6 py-3 rounded-xl shadow-md hover:bg-gray-400 transition duration-300 disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    ← Edit Details
                  </button>
                  <button
                    type="submit"
                    className="bg-accent-success text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-green-300 hover:bg-green-700 transition duration-300 transform hover:scale-[1.01] flex items-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <span>Confirm & Submit Booking</span>
                    )}
                  </button>
                </div>
              </div>
            )
          ),
        }),
      100
    );
  });
});

const Step3Confirmation = lazy(() => {
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          default: React.memo(
            ({ name, contact, clearCart, setActivePage, navigate }) => (
              <div className="max-w-2xl mx-auto p-8 bg-white border border-gray-200 rounded-2xl shadow-lg">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-20 h-20 flex items-center justify-center bg-green-500 text-white rounded-full shadow-md">
                    <svg
                      className="w-10 h-10"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-semibold text-gray-900 mt-4">
                    Booking Confirmed
                  </h3>
                  <p className="text-green-700 font-medium">
                    Your rental is successfully booked.
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-left mb-6">
                  <p className="text-gray-800 text-lg font-semibold mb-2">
                    Hello,{" "}
                    <span className="text-primary-600">
                      {name.split(" ")[0]}
                    </span>
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Your booking with{" "}
                    <strong className="text-primary-600">
                      {BRAND_CONFIG.name}
                    </strong>{" "}
                    has been confirmed. Our team is preparing your equipment for
                    pickup.
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6">
                  <h4 className="text-green-800 font-semibold mb-3 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
                      />
                    </svg>
                    What Happens Next
                  </h4>
                  <ul className="text-gray-700 text-sm space-y-2 pl-1">
                    <li>
                      • Our team will contact you within 2 hours at {contact}
                    </li>
                    <li>• Pickup details and timing will be confirmed</li>
                    <li>• Keep your ID proof ready for verification</li>
                  </ul>
                </div>

                <div className="text-gray-700 text-sm mb-8 bg-primary-50 border border-primary-200 rounded-lg p-4">
                  <p className="font-semibold text-primary-700 mb-1">
                    Need Help?
                  </p>
                  <p>
                    Call us at{" "}
                    <strong>{BRAND_CONFIG.phone || "+91-XXXXXXXXXX"}</strong> or
                    email{" "}
                    <strong>
                      {BRAND_CONFIG.email || "support@example.com"}
                    </strong>
                    .
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => {
                      clearCart();
                      setActivePage("home");
                      navigate("/");
                    }}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-all"
                  >
                    Return Home
                  </button>
                  <button
                    onClick={() => {
                      clearCart();
                      setActivePage("cameras");
                      navigate("/cameras");
                    }}
                    className="border border-gray-300 hover:border-primary-400 hover:text-primary-600 px-8 py-3 rounded-lg font-semibold transition-all text-gray-700"
                  >
                    Browse More Equipment
                  </button>
                </div>

                <div className="mt-8 border-t border-gray-200 pt-4 text-center">
                  <p className="text-gray-500 text-sm">
                    We appreciate your trust in{" "}
                    <span className="font-semibold text-primary-600">
                      {BRAND_CONFIG.name}
                    </span>
                    . See you soon.
                  </p>
                </div>
              </div>
            )
          ),
        }),
      100
    );
  });
});

// Loader component
const Loader = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
  </div>
);

const BookingForm = ({
  cart,
  setNotification,
  setActivePage,
  clearCart,
  numberOfDays,
  rentalDates,
  subtotal,
}) => {
  const navigate = useNavigate();

  const [submissionDetails, setSubmissionDetails] = useState(null);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    contact: "",
    address: "",
    emergencyContact: "",
    idProof: null,
    userPhoto: null,
  });
  const [formErrors, setFormErrors] = useState({});
  const [bookingCompleted, setBookingCompleted] = useState(false);

  // Calculate cameras and accessories FIRST
  const cameras = cart
    .filter((item) => {
      const isCamera = item.category === "camera";
      return isCamera;
    })
    .map((item) => item._id);

  const accessories = cart
    .filter((item) => {
      const isAccessory = item.category === "accessory";
      return isAccessory;
    })
    .map((item) => item._id);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const finalTotalCost = subtotal * numberOfDays;

  // Debug: Check cart items and categories
  useEffect(() => {
    // console.log("=== CART DEBUG ===");
    // console.log("Cart items:", cart);
    // console.log("Submission details:", submissionDetails);
    // console.log("Current step:", step);
    // console.log("Booking completed:", bookingCompleted);
  }, [cart, submissionDetails, step, bookingCompleted]);

  // Redirect if cart is empty (only if no booking completed)
  useEffect(() => {
    if (cart.length === 0 && !bookingCompleted && !submissionDetails) {
      setActivePage("cart");
      setNotification({
        message: "Your cart is empty. Please add items before booking.",
        type: "error",
      });
    }
  }, [
    cart.length,
    bookingCompleted,
    submissionDetails,
    setActivePage,
    setNotification,
  ]);

  // Early return must be AFTER all hooks
  if (cart.length === 0 && !bookingCompleted && !submissionDetails) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    const { name } = e.target;

    setForm({
      ...form,
      [name]: file,
    });

    // Clear file error
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateStep1 = () => {
    const errors = {};

    if (!form.fullName.trim()) {
      errors.fullName = "Full name is required";
    }

    if (!form.email.trim()) {
      errors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        errors.email = "Please enter a valid email address";
      }
    }

    if (!form.contact.trim()) {
      errors.contact = "Contact number is required";
    } else {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(form.contact.replace(/\D/g, ""))) {
        errors.contact = "Please enter a valid 10-digit phone number";
      }
    }

    if (!form.address.trim()) {
      errors.address = "Address is required";
    }

    if (!form.emergencyContact.trim()) {
      errors.emergencyContact = "Emergency contact is required";
    } else {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(form.emergencyContact.replace(/\D/g, ""))) {
        errors.emergencyContact = "Please enter a valid 10-digit phone number";
      }
    }

    if (!form.idProof) {
      errors.idProof = "ID Proof is required";
    }

    if (!form.userPhoto) {
      errors.userPhoto = "User photo is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = (e) => {
    e.preventDefault();

    if (step === 1) {
      if (!validateStep1()) {
        setNotification({
          message: "Please fix the errors before proceeding.",
          type: "error",
        });
        return;
      }
    }

    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step === 2) {
      await submitBooking();
    }
  };

  const submitBooking = async () => {
    setIsSubmitting(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("fullName", form.fullName);
      formData.append("email", form.email);
      formData.append("contact", form.contact);
      formData.append("address", form.address);
      formData.append("emergencyContact", form.emergencyContact);
      formData.append(
        "rentalPeriod",
        `${rentalDates.start} to ${rentalDates.end} (${numberOfDays} days)`
      );

      // Append arrays of camera and accessory IDs
      cameras.forEach((cameraId) => {
        formData.append("cameras", cameraId);
      });

      accessories.forEach((accessoryId) => {
        formData.append("accessories", accessoryId);
      });

      // Append files
      if (form.idProof) {
        formData.append("idProof", form.idProof);
      }
      if (form.userPhoto) {
        formData.append("userPhoto", form.userPhoto);
      }

      // console.log("Submitting booking...");

      await createBooking(formData);

      // console.log("Booking successful!");

      const contactInfo = {
        name: form.fullName,
        email: form.email,
        contact: form.contact,
      };

      setSubmissionDetails(contactInfo);
      setBookingCompleted(true);
      setStep(3); // Force step to 3 immediately

      // Clear cart but don't navigate away

      setNotification({
        message: "Booking confirmed! Thank you!",
        type: "success",
      });
    } catch (err) {
      console.error("Booking submission error:", err);
      setNotification({
        message:
          err.response?.data?.message ||
          "Error confirming booking. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPhoneNumber = (value) => {
    const phone = value.replace(/\D/g, "");
    if (phone.length <= 10) {
      return phone;
    }
    return phone.slice(0, 10);
  };

  const handlePhoneChange = (e) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    handleChange({
      target: {
        name: e.target.name,
        value: formattedPhone,
      },
    });
  };

  const renderStep = () => {
    // console.log("Rendering step:", step);

    switch (step) {
      case 1:
        return (
          <Suspense fallback={<Loader />}>
            <Step1Form
              form={form}
              formErrors={formErrors}
              rentalDates={rentalDates}
              numberOfDays={numberOfDays}
              handleChange={handleChange}
              handlePhoneChange={handlePhoneChange}
              handleFileChange={handleFileChange}
              handleNext={handleNext}
            />
          </Suspense>
        );
      case 2:
        return (
          <Suspense fallback={<Loader />}>
            <Step2Review
              cart={cart}
              cartItemCount={cartItemCount}
              form={form}
              rentalDates={rentalDates}
              numberOfDays={numberOfDays}
              subtotal={subtotal}
              finalTotalCost={finalTotalCost}
              isSubmitting={isSubmitting}
              handleBack={handleBack}
              handleSubmit={handleSubmit}
            />
          </Suspense>
        );
      case 3: {
        // Show confirmation page - even if cart is empty
        const { name, email, contact } = submissionDetails || {
          name: "Valued Customer",
          email: "your registered email",
          contact: "your registered number",
        };

        return (
          <Suspense fallback={<Loader />}>
            <Step3Confirmation
              name={name}
              email={email}
              contact={contact}
              clearCart={clearCart}
              setActivePage={setActivePage}
              navigate={navigate}
            />
          </Suspense>
        );
      }
      default:
        return <p className="text-gray-900">An unexpected error occurred.</p>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 bg-white shadow-2xl shadow-gray-300 rounded-2xl my-10 border-t-8 border-primary-500">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
        Equipment Rental Checkout
      </h2>

      {/* Progress Indicator */}
      <div className="flex justify-between mb-8">
        {[1, 2, 3].map((stepNum) => (
          <div key={stepNum} className="text-center flex-1">
            <div className="flex items-center">
              {stepNum > 1 && (
                <div
                  className={`flex-1 h-1 ${
                    step >= stepNum
                      ? stepNum === 3
                        ? "bg-accent-success"
                        : "bg-primary-500"
                      : "bg-gray-300"
                  }`}
                />
              )}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= stepNum
                    ? stepNum === 3
                      ? "bg-accent-success text-white"
                      : "bg-primary-500 text-white"
                    : "bg-gray-300 text-gray-800"
                }`}
              >
                {stepNum}
              </div>
              {stepNum < 3 && (
                <div
                  className={`flex-1 h-1 ${
                    step > stepNum
                      ? stepNum === 2
                        ? "bg-accent-success"
                        : "bg-primary-500"
                      : "bg-gray-300"
                  }`}
                />
              )}
            </div>
            <p
              className={`text-sm mt-1 ${
                step === stepNum
                  ? stepNum === 3
                    ? "text-accent-success font-bold"
                    : "text-primary-500 font-bold"
                  : "text-gray-500"
              }`}
            >
              {stepNum === 1
                ? "Contact Details"
                : stepNum === 2
                ? "Review & Confirm"
                : "Success"}
            </p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <Suspense fallback={<Loader />}>{renderStep()}</Suspense>
      </form>
    </div>
  );
};

export default BookingForm;
