const express = require('express');
const { adminLogin, createCandidate, deleteCandidate } = require('../controller/adminController');
const upload = require('../middleware/multer');

const router = express.Router();

router.route('/login').get((req, res) => {
    res.render('adminLogin');
}).post(adminLogin);

router.route('/createCandidate').get((req, res) => {
    res.render('createCandidate');
}).post(upload.single("image"), createCandidate);

router.route('/deleteCandidate').get((req, res) => {
    res.render('deleteCandidate')
}).post(deleteCandidate);

module.exports = router;