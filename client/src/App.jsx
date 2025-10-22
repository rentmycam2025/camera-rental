import React, { useState, useCallback, useEffect, Suspense } from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";

// Hooks
import { useApi } from "./hooks/useApi";
import { useCart } from "./hooks/useCart";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Notification from "./components/Notification";
import ScrollToTop from "./components/ScrollToTop";
import Loader from "./components/Loader";

// Pages
const Home = React.lazy(() => import("./pages/Home"));
const CameraList = React.lazy(() => import("./pages/CameraList"));
const AccessoryList = React.lazy(() => import("./pages/AccessoryList"));
const ProductDetail = React.lazy(() => import("./pages/ProductDetail"));
const CartPage = React.lazy(() => import("./pages/Cart"));
const BookingForm = React.lazy(() => import("./pages/BookingForm"));
const Terms = React.lazy(() => import("./pages/Terms"));
const Privacy = React.lazy(() => import("./pages/Privacy"));

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  const [notification, setNotification] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activePage, setActivePage] = useState("home");

  // Data fetching hook
  const { cameraList, accessoryList, isLoading } = useApi(setNotification);

  // Cart logic hook
  const {
    cart,
    rentalDates,
    numberOfDays,
    subtotal,
    cartCount,
    handleDateChange,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
  } = useCart(setNotification, setActivePage);

  // Handler for viewing product detail
  // const handleViewDetail = useCallback(
  //   (item) => {
  //     setSelectedItem(item);
  //     navigate("/product", { state: { item } });
  //     setActivePage("detail");
  //   },
  //   [navigate]
  // );
  // Updated handler for dynamic product URLs
  const handleViewDetail = useCallback(
    (item) => {
      // Generate URL-friendly slug
      const slug = item.name.toLowerCase().replace(/\s+/g, "-");
      navigate(`/product/${slug}`);
      setSelectedItem(item);
      setActivePage("detail");
    },
    [navigate]
  );

  // Handler for search selection
  const handleSearchSelect = useCallback(
    (item) => {
      const slug = item.name.toLowerCase().replace(/\s+/g, "-");
      navigate(`/product/${slug}`);
      setSelectedItem(item);
      setActivePage("detail");
      setNotification({
        message: `Navigating to ${item.name}`,
        type: "success",
      });
    },
    [navigate]
  );

  // Sync active page with route changes
  useEffect(() => {
    const path = location.pathname;
    if (path === "/") setActivePage("home");
    else if (path === "/cameras") setActivePage("cameras");
    else if (path === "/accessories") setActivePage("accessories");
    else if (path === "/cart") setActivePage("cart");
    else if (path === "/booking") setActivePage("booking");
    else if (path === "/product") setActivePage("detail");
    else if (path === "/privacy") setActivePage("privacy");
    else if (path === "/terms") setActivePage("terms");
    else setActivePage("");
  }, [location.pathname]);

  const handlePageChange = useCallback(
    (page) => {
      setActivePage(page);
      switch (page) {
        case "home":
          navigate("/");
          break;
        case "cameras":
          navigate("/cameras");
          break;
        case "accessories":
          navigate("/accessories");
          break;
        case "cart":
          navigate("/cart");
          break;
        case "booking":
          navigate("/booking");
          break;
        case "privacy":
          navigate("/privacy");
          break;
        case "terms":
          navigate("/terms");
          break;
        default:
          navigate("/");
      }
    },
    [navigate]
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar
        activePage={activePage}
        setActivePage={handlePageChange}
        cartCount={cartCount}
        onSearchSelect={handleSearchSelect}
        cameraList={cameraList}
        accessoryList={accessoryList}
        isLoading={isLoading} // Pass loading state
      />

      <main className="flex-grow">
        <ScrollToTop />
        <Suspense
          fallback={
            <div className="flex items-center justify-center text-center min-h-[90vh] py-10">
              <Loader />
            </div>
          }
        >
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  cameraList={cameraList}
                  accessoryList={accessoryList}
                  onViewDetail={handleViewDetail}
                  isLoading={isLoading}
                  setActivePage={setActivePage}
                />
              }
            />
            <Route
              path="/cameras"
              element={
                <CameraList
                  cameraList={cameraList}
                  isLoading={isLoading}
                  onViewDetail={handleViewDetail}
                  setActivePage={setActivePage}
                />
              }
            />
            <Route
              path="/accessories"
              element={
                <AccessoryList
                  accessoryList={accessoryList}
                  isLoading={isLoading}
                  onViewDetail={handleViewDetail}
                  setActivePage={setActivePage}
                />
              }
            />
            {/* <Route
            path="/product/:slug"
            element={
              <ProductDetail
                item={location.state?.item || selectedItem}
                addToCart={addToCart}
                setActivePage={setActivePage}
              />
            }
          /> */}
            <Route
              path="/product/:slug"
              element={
                <ProductDetail
                  cameraList={cameraList}
                  accessoryList={accessoryList}
                  addToCart={addToCart}
                  setActivePage={setActivePage}
                />
              }
            />

            <Route
              path="/cart"
              element={
                <CartPage
                  cart={cart}
                  updateCartQuantity={updateCartQuantity}
                  removeFromCart={removeFromCart}
                  clearCart={clearCart}
                  rentalDates={rentalDates}
                  handleDateChange={handleDateChange}
                  numberOfDays={numberOfDays}
                  subtotal={subtotal}
                  setActivePage={setActivePage}
                />
              }
            />
            <Route
              path="/booking"
              element={
                <BookingForm
                  cart={cart}
                  setNotification={setNotification}
                  setActivePage={setActivePage}
                  clearCart={clearCart}
                  numberOfDays={numberOfDays}
                  rentalDates={rentalDates}
                  subtotal={subtotal}
                />
              }
            />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
