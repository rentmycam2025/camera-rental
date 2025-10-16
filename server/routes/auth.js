// routes/auth.js
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Single admin credentials (you can move these to .env)
const ADMIN_EMAIL = process.env.ADMIN_LOGIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ email, role: "admin" }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: { email, role: "admin" },
    });
  }

  return res
    .status(401)
    .json({ success: false, message: "Invalid email or password" });
});

module.exports = router;
