const express = require('express');
const { adminLogin } = require('../controller/adminController');

const router = express.Router();

router.route('/login').get((req, res) => {
    res.render('adminLogin');
}).post(adminLogin);

module.exports = router;