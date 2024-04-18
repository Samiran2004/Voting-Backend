const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

async function userAuth(req, res, next) {
    try {
        const token = req.cookies.token;
        if (!token) {
            res.render('error', { errorMessage: "Token not found" });
        } else {
            const decodetoken = await jwt.verify(token, process.env.JWT_SECRET);
            if (decodetoken.role === 'voter' && decodetoken.isVoted == false) {
                let user = await User.findById(decodetoken._id);
                if (!user) {
                    res.render('error', { errorMessage: "User is not found" });
                } else {
                    req.user = user;
                    next();
                }
            } else {
                res.render('error', { errorMessage: "You are not a voter or you already vote one candidate" });
            }
        }
    } catch (error) {
        res.render('error', { errorMessage: "Internal Server Error" })
    }
}

module.exports = userAuth;