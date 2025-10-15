// context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";

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

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem("adminToken");
    const userData = localStorage.getItem("adminUser");

    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Simple admin authentication
    const adminUsers = [
      { id: 1, email: "admin@camerarental.com", name: "Admin", role: "admin" },
      {
        id: 2,
        email: "manager@camerarental.com",
        name: "Manager",
        role: "manager",
      },
    ];

    const adminUser = adminUsers.find(
      (u) => u.email === email && password === "admin123"
    );

    if (adminUser) {
      const userData = { ...adminUser, token: "admin-token-" + Date.now() };
      setUser(userData);
      localStorage.setItem("adminToken", userData.token);
      localStorage.setItem("adminUser", JSON.stringify(userData));
      return { success: true, user: userData };
    } else {
      return { success: false, error: "Invalid credentials" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
  };

  const value = {
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
