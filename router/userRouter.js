const express = require('express');
const loginRateLimiter = require('../middleware/rateLimitMiddleware');
const { getSignup, signUp, login } = require('../controller/userController');
const { getVotingPage, vote, getData } = require('../controller/voteController');
const userAuth = require('../middleware/userAuthMiddleware');
const router = express.Router();

router.get('/signup', getSignup);
router.post('/signup', signUp);

router.route('/login').get((req, res) => {
    res.render('login')
}).post(login);

router.route('/getdata').get(getData);

router.route('/vote').get(userAuth, getVotingPage).post(userAuth,vote);

module.exports = router;