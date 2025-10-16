// components/AdminHeader.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BRAND_CONFIG } from "../config/constants";

const AdminHeader = ({ setNotification, setActivePage }) => {
  const navigate = useNavigate();
  const { logout } = useAuth(); // ✅ get logout function

  const handleLogout = () => {
    logout(); // logs out user
    if (setNotification) {
      setNotification({
        message: "Logged out successfully",
        type: "success",
      });
    }
    if (setActivePage) setActivePage("home");
    navigate("/admin/login");
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-between items-center py-6 gap-2">
          {/* Left Section: Logo + Title */}
          <div className="flex items-center gap-3">
            <img
              src={BRAND_CONFIG.logo}
              alt={BRAND_CONFIG.name}
              className="h-8 w-auto"
            />
            <h1 className="text-2xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
          </div>

          {/* Right Section: Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => navigate("/admin/cameras")}
              className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 text-sm"
            >
              Cameras
            </button>
            <button
              onClick={() => navigate("/admin/accessories")}
              className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 text-sm"
            >
              Accessories
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-2 border border-red-600 rounded-md text-white bg-red-600 hover:bg-red-700 text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
