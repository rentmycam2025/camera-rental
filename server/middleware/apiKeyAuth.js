// middleware/apiKeyAuth.js
require("dotenv").config();

const apiKeyAuth = (req, res, next) => {
  if (req.method === "OPTIONS") return next(); // allow preflight

  const clientKey = req.headers["x-api-key"];
  if (!clientKey || clientKey !== process.env.API_KEY) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

module.exports = { apiKeyAuth };
