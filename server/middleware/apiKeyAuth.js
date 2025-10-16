require("dotenv").config();

const apiKeyAuth = (req, res, next) => {
  const clientKey = req.headers["x-api-key"];
  if (!clientKey || clientKey !== process.env.API_KEY) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

module.exports = { apiKeyAuth };
