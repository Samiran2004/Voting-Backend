const express = require('express');
const loginRateLimiter = require('../middleware/rateLimitMiddleware');
const { getSignup, signUp } = require('../controller/userController');
const router = express.Router();

router.get('/signup', getSignup);
router.post('/signup', signUp)

module.exports = router;