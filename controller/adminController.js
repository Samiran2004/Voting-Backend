const User = require('../models/userModel');
const Candidate = require('../models/candidateModel');
const jwt = require('jsonwebtoken');
const adminLogin = async (req, res) => {
    try {
        const { aadhar, secret, adminid } = req.body;
        if (!aadhar || !secret || !adminid) {
            res.render('error', { errorMessage: "All fields are required." });
        } else {
            //Check the user....
            const check = await User.findById(adminid);
            if (check) {
                //Check Secret...
                if (check.secretKey === secret) {
                    const payload = {
                        _id: check._id,
                        name: check.name,
                        role: check.role
                    };
                    const token = jwt.sign(payload,process.env.JWT_SECRET);
                    res.cookie('token', token).render('home');
                }
            } else {
                res.render('error', { errorMessage: "Aadhar or secret or adminid is invalid." })
            }
        }
    } catch (error) {
        res.render('error', { errorMessage: "Internal Server Error" })
    }
}

module.exports = {
    adminLogin
}