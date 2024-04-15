const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
function validateToken(cookieName) {
    return async(req, res, next) => {
        const tokenValue = req.cookies[cookieName];
        if (!tokenValue) {
            return next(); // No token, move to the next middleware
        } else {
            try {
                const userPayload = jwt.verify(tokenValue, process.env.JWT_SECRET);
                const check = await User.findById(userPayload._id);
                if(check){
                    res.locals.user = userPayload;
                    return next();
                }else{
                    return next();
                }
            } catch (error) {
                return next(); 
            }
        }
    };
}
module.exports = validateToken;