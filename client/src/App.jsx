// App.jsx - Updated to hide Navbar and Footer on admin routes
import React, { useState, useCallback, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";

// Context
import { AuthProvider, useAuth } from "./context/AuthContext";

// Hooks
import { useApi } from "./hooks/useApi";
import { useCart } from "./hooks/useCart";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Notification from "./components/Notification";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import CameraList from "./pages/CameraList";
import AccessoryList from "./pages/AccessoryList";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/Cart";
import BookingForm from "./pages/BookingForm";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCameras from "./pages/admin/AdminCameras";
import AdminAccessories from "./pages/admin/AdminAccessories";

// Router Wrapper Component
function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [notification, setNotification] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activePage, setActivePage] = useState("home");

  // Check if current route is an admin route
  const isAdminRoute = location.pathname.startsWith("/admin");

  // Data fetching hook
  const { cameraList, accessoryList, isLoading } = useApi(setNotification);

  // Debug useEffect
  useEffect(() => {
    console.log("Camera List in App:", cameraList);
    console.log("Accessory List in App:", accessoryList);
  }, [cameraList, accessoryList]);

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
  const handleViewDetail = useCallback(
    (item) => {
      setSelectedItem(item);
      navigate("/product", { state: { item } });
      setActivePage("detail");
    },
    [navigate]
  );

  // Handler for search selection
  const handleSearchSelect = useCallback(
    (item) => {
      console.log("Search selected item:", item);
      setSelectedItem(item);
      navigate("/product", { state: { item } });
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
    else if (path === "/admin/login") setActivePage("admin-login");
    else if (path === "/admin/dashboard") setActivePage("admin-dashboard");
    else if (path === "/admin/cameras") setActivePage("admin-cameras");
    else if (path === "/admin/accessories") setActivePage("admin-accessories");
  }, [location.pathname]);

  // Handler for page navigation
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
        case "admin-login":
          navigate("/admin/login");
          break;
        case "admin-dashboard":
          navigate("/admin/dashboard");
          break;
        case "admin-cameras":
          navigate("/admin/cameras");
          break;
        case "admin-accessories":
          navigate("/admin/accessories");
          break;
        default:
          navigate("/");
      }
    },
    [navigate]
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Conditionally render Navbar - hide on admin routes */}
      {!isAdminRoute && (
        <Navbar
          activePage={activePage}
          setActivePage={handlePageChange}
          cartCount={cartCount}
          onSearchSelect={handleSearchSelect}
          cameraList={cameraList}
          accessoryList={accessoryList}
          user={user}
        />
      )}

      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
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
          <Route
            path="/product"
            element={
              <ProductDetail
                item={location.state?.item || selectedItem}
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

          {/* Admin Routes */}
          <Route
            path="/admin/login"
            element={
              <AdminLogin
                setNotification={setNotification}
                setActivePage={setActivePage}
              />
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute
                setNotification={setNotification}
                setActivePage={setActivePage}
              >
                <AdminDashboard
                  setNotification={setNotification}
                  setActivePage={setActivePage}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/cameras"
            element={
              <ProtectedRoute
                setNotification={setNotification}
                setActivePage={setActivePage}
              >
                <AdminCameras
                  setNotification={setNotification}
                  setActivePage={setActivePage}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/accessories"
            element={
              <ProtectedRoute
                setNotification={setNotification}
                setActivePage={setActivePage}
              >
                <AdminAccessories
                  setNotification={setNotification}
                  setActivePage={setActivePage}
                />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {/* Conditionally render Footer - hide on admin routes */}
      {!isAdminRoute && <Footer />}

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

// Main App component with Router and AuthProvider
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
