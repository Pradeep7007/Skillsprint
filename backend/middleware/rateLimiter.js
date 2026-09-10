const rateLimit = require('express-rate-limit');

// General API rate limiter
exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Authentication rate limiter (tighter constraints)
exports.authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 30, // Limit each IP to 30 requests per windowMs for auth routes
  message: {
    success: false,
    message: 'Too many login or registration attempts, please try again after 10 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
