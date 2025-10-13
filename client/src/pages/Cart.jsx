import React from "react";
import { Link } from "react-router-dom";

const Cart = ({
  cart,
  updateCartQuantity,
  removeFromCart,
  setActivePage,
  clearCart,
  rentalDates,
  handleDateChange,
  numberOfDays,
  subtotal,
}) => {
  // Constants for calculation and display
  const estimatedTotal = subtotal * numberOfDays;
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Helper for current date to set minimum date for inputs
  const today = new Date().toISOString().split("T")[0];

  // --- Empty Cart State ---
  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-10 my-16 text-center bg-white rounded-3xl shadow-2xl border-b-8 border-primary-500/80">
        <svg
          className="w-16 h-16 mx-auto text-primary-500 mb-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
        <h2 className="text-4xl font-black text-gray-900 mb-3">
          Your Cart is Empty
        </h2>
        <p className="text-lg text-gray-600 mb-10 max-w-sm mx-auto">
          It looks like you haven't added any gear yet. Find the perfect
          equipment for your next shoot.
        </p>
        <Link to="/cameras">
          <button
            onClick={() => setActivePage("cameras")}
            className="bg-primary-500 text-white font-semibold tracking-wide uppercase px-10 py-4 rounded-xl shadow-lg shadow-primary-500/40 hover:bg-primary-600 transition duration-300 transform hover:scale-[1.02]"
          >
            Browse Gear Now
          </button>
        </Link>
      </div>
    );
  }

  // --- Cart Content View ---
  return (
    <>
      {" "}
      {/* Use fragment to allow for the fixed footer */}
      <div className="max-w-7xl mx-auto p-4 md:p-8 my-10 font-sans">
        {/* Header */}
        <h2 className="text-4xl font-extrabold text-gray-900 mb-10 pb-4 border-b border-gray-200 flex justify-between items-center">
          <span className="tracking-tight">
            Review Your Gear{" "}
            <span className="text-primary-500">({cartItemCount})</span>
          </span>
          <button
            onClick={clearCart}
            className="text-base text-accent-error hover:text-red-700 transition font-medium flex items-center p-2 rounded-lg hover:bg-red-50"
          >
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Clear Cart
          </button>
        </h2>

        {/* Added pb-20 to ensure content isn't hidden behind the fixed footer on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20 lg:pb-0">
          {/* Cart Items List (2/3 width on desktop) */}
          <div className="lg:col-span-2 space-y-5">
            {cart.map((item) => {
              const price = item.offerPrice || item.pricePerDay;
              const itemTotal = price * item.quantity;
              return (
                <div
                  key={item._id}
                  className="bg-white p-5 rounded-xl shadow-lg flex flex-col sm:flex-row items-start transition duration-300 hover:shadow-xl border border-gray-100"
                >
                  {/* Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full sm:w-32 h-32 object-contain rounded-xl shrink-0 sm:mr-6 mb-4 sm:mb-0 border border-gray-200"
                  />

                  {/* Details and Controls */}
                  <div className="flex-grow w-full">
                    <div className="flex justify-between items-start mb-2">
                      {/* Name & Price per day */}
                      <div>
                        <h3 className="font-bold text-xl text-gray-900 leading-snug">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Daily Rate:{" "}
                          <span className="font-medium text-primary-500">
                            ₹{price.toLocaleString()}/day
                          </span>
                        </p>
                      </div>

                      {/* Remove Button (Desktop Top Right) */}
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="hidden sm:block text-xs text-accent-error hover:text-red-700 transition font-medium"
                      >
                        Remove
                      </button>
                    </div>

                    {/* Quantity and Total (Responsive Layout) */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mt-4 border-t pt-4">
                      {/* Quantity Selector */}
                      <div className="flex items-center space-x-3 mb-4 md:mb-0">
                        <span className="text-sm font-medium text-gray-600 mr-2">
                          Quantity:
                        </span>
                        <button
                          onClick={() =>
                            updateCartQuantity(item._id, item.quantity - 1)
                          }
                          className="bg-gray-100 border border-gray-300 text-gray-800 w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center transition disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M20 12H4"
                            />
                          </svg>
                        </button>
                        <span className="font-bold text-lg w-6 text-center text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateCartQuantity(item._id, item.quantity + 1)
                          }
                          className="bg-gray-100 border border-gray-300 text-gray-800 w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center transition"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-left md:text-right">
                        <p className="text-sm text-gray-600 mb-1">
                          Item Subtotal:
                        </p>
                        <p className="font-extrabold text-primary-600 text-2xl">
                          ₹{itemTotal.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Remove Button (Mobile Bottom) */}
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="sm:hidden text-xs text-accent-error hover:text-red-700 transition font-medium mt-3"
                    >
                      Remove Item
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Card (1/3 width on desktop) */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-xl shadow-gray-300 h-fit sticky top-4 lg:top-8 border-t-4 border-primary-500 space-y-6">
              {/* Rental Period Selection */}
              <div className="space-y-4 pb-4 border-b border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900">
                  Rental Period
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  {/* Start Date */}
                  <div>
                    <label
                      htmlFor="startDate"
                      className="block text-sm font-semibold text-gray-700 mb-1"
                    >
                      Start Date
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      name="start"
                      value={rentalDates.start}
                      onChange={handleDateChange}
                      min={today}
                      className="w-full border border-gray-300 p-3 rounded-xl bg-gray-50 text-gray-900 focus:ring-primary-500 focus:border-primary-500 transition"
                    />
                  </div>

                  {/* End Date */}
                  <div>
                    <label
                      htmlFor="endDate"
                      className="block text-sm font-semibold text-gray-700 mb-1"
                    >
                      End Date
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      name="end"
                      value={rentalDates.end}
                      onChange={handleDateChange}
                      min={rentalDates.start || today}
                      className="w-full border border-gray-300 p-3 rounded-xl bg-gray-50 text-gray-900 focus:ring-primary-500 focus:border-primary-500 transition"
                    />
                  </div>
                </div>

                {/* Rental Days Display */}
                {numberOfDays > 0 && (
                  <p className="text-lg font-bold text-gray-800 pt-2 text-center">
                    Total Days:{" "}
                    <span className="text-primary-500">
                      {numberOfDays} day{numberOfDays !== 1 ? "s" : ""}
                    </span>
                  </p>
                )}
                {numberOfDays === 0 && rentalDates.start && rentalDates.end && (
                  <p className="text-sm text-accent-error text-center p-2 bg-red-50 rounded-lg">
                    End date must be after start date.
                  </p>
                )}
              </div>

              {/* Order Summary */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900 pb-1">
                  Order Summary
                </h3>

                <div className="space-y-3 text-gray-700">
                  <div className="flex justify-between text-base">
                    <span className="font-medium">Daily Subtotal:</span>
                    <span className="font-semibold text-gray-800">
                      ₹{subtotal.toLocaleString()}/day
                    </span>
                  </div>
                  <div className="flex justify-between text-base">
                    <span className="font-medium">Rental Days:</span>
                    <span className="font-semibold text-gray-800">
                      {numberOfDays > 0 ? `${numberOfDays} Days` : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between text-2xl font-extrabold pt-4 border-t border-gray-200">
                    <span>Final Total:</span>
                    <span
                      className={`transition-opacity ${
                        numberOfDays > 0
                          ? "text-accent-success"
                          : "text-gray-400"
                      }`}
                    >
                      ₹{estimatedTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Checkout Button (DESKTOP ONLY - hidden on mobile) */}
                <Link to="/booking">
                  <button
                    onClick={() => setActivePage("booking")}
                    className={`hidden lg:flex mt-6 w-full text-white font-black uppercase tracking-wider px-6 py-4 rounded-xl shadow-lg transition duration-300 transform hover:scale-[1.01] items-center justify-center space-x-2 ${
                      numberOfDays > 0
                        ? "bg-primary-500 shadow-primary-500/50 hover:bg-primary-600"
                        : "bg-gray-400 text-gray-700 cursor-not-allowed opacity-70 shadow-none"
                    }`}
                    disabled={numberOfDays === 0}
                  >
                    {numberOfDays > 0 ? (
                      <>
                        <span>Proceed to Checkout</span>
                        <svg
                          className="w-5 h-5 ml-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 9l3 3m0 0l-3 3m3-3H8M1 12a11 11 0 0122 0 11 11 0 01-22 0z"
                          />
                        </svg>
                      </>
                    ) : (
                      <span>Select Rental Period</span>
                    )}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* --- Mobile Fixed Checkout Bar (Visible ONLY on screens < lg) --- */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-2xl z-50">
        <Link to="/booking">
          <button
            onClick={() => setActivePage("booking")}
            className={`w-full text-white font-black uppercase tracking-wider px-6 py-3 rounded-xl shadow-lg transition duration-300 flex items-center justify-center space-x-2 ${
              numberOfDays > 0
                ? "bg-primary-500 shadow-primary-500/50 hover:bg-primary-600"
                : "bg-gray-400 text-gray-700 cursor-not-allowed opacity-70 shadow-none"
            }`}
            disabled={numberOfDays === 0}
          >
            {numberOfDays > 0 ? (
              <>
                {/* Shows the calculated total right in the button */}
                <span>
                  Proceed to Checkout (₹{estimatedTotal.toLocaleString()})
                </span>
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 9l3 3m0 0l-3 3m3-3H8M1 12a11 11 0 0122 0 11 11 0 01-22 0z"
                  />
                </svg>
              </>
            ) : (
              <span>Select Rental Period</span>
            )}
          </button>
        </Link>
      </div>
      {/* --------------------------------- */}
    </>
  );
};

export default Cart;
