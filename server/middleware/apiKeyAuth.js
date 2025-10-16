require("dotenv").config();

const apiKeyAuth = (req, res, next) => {
  // Allow preflight requests to pass
  if (req.method === "OPTIONS") return next();

  const clientKey = req.headers["x-api-key"];
  if (!clientKey || clientKey !== process.env.API_KEY) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  next();
};

module.exports = { apiKeyAuth };
