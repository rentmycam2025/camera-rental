// context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper: check if JWT is expired
  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000; // current time in seconds
      return decoded.exp < now;
    } catch (err) {
      return true; // invalid token
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const userData = localStorage.getItem("adminUser");

    if (token && userData && !isTokenExpired(token)) {
      setUser(JSON.parse(userData));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      logout(); // token missing or expired
    }
    setLoading(false);
  }, []);

  // ✅ Login using backend
  const login = async (email, password) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        { email, password },
        {
          headers: {
            "x-api-key": import.meta.env.VITE_API_KEY,
          },
        }
      );

      if (res.data.success) {
        const { token, user } = res.data;

        localStorage.setItem("adminToken", token);
        localStorage.setItem("adminUser", JSON.stringify(user));
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        setUser(user);
        // Schedule auto logout when token expires
        scheduleAutoLogout(token);
        return { success: true, user };
      } else {
        return { success: false, error: res.data.message };
      }
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, error: "Invalid credentials or server error" };
    }
  };

  // ✅ Automatically log out when token expires
  const scheduleAutoLogout = (token) => {
    const decoded = jwtDecode(token);
    const expiryTime = decoded.exp * 1000 - Date.now(); // in ms

    setTimeout(() => {
      logout();
      alert("Session expired. Please log in again.");
    }, expiryTime);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    delete axios.defaults.headers.common["Authorization"];
  };

  const value = { user, login, logout, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
