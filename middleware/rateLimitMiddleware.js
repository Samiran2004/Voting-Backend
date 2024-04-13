const ratelimit = require('express-rate-limit');
const loginRateLimiter = ratelimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // 5 requests per minute
    message: "Too many login attempts. Please try again later."
});

module.exports = loginRateLimiter;