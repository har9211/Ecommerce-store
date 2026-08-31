const rateLimit = require("express-rate-limit");

// Applies to login/register: at most 10 attempts per 15 minutes per IP.
// Slows down brute-force password guessing and mass fake-account creation.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { message: "Too many attempts. Please try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { authLimiter };
