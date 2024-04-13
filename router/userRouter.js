const express = require('express');
const { signup, login } = require('../controller/userController');
const loginRateLimiter = require('../middleware/rateLimitMiddleware');
const router = express.Router();

//Signup router....
router.post('/signup', signup);

//Login router....
router.post('/login', loginRateLimiter, login);
module.exports = router;