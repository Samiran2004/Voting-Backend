const express = require('express');
const loginRateLimiter = require('../middleware/rateLimitMiddleware');
const { getSignup, signUp, login } = require('../controller/userController');
const router = express.Router();

router.get('/signup', getSignup);
router.post('/signup', signUp);

router.route('/login').get((req, res) => {
    res.render('login')
}).post(login)

module.exports = router;