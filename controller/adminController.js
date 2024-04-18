const User = require('../models/userModel');
const Candidate = require('../models/candidateModel');
const jwt = require('jsonwebtoken');
const cloudinary = require('../services/cloudinary');
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
                    const token = jwt.sign(payload, process.env.JWT_SECRET);
                    res.cookie('token', token).render('adminHome');
                } else {
                    res.render('error', { errorMessage: "Aadhar or secret or adminid is invalid." })
                }
            } else {
                res.render('error', { errorMessage: "Aadhar or secret or adminid is invalid." })
            }
        }
    } catch (error) {
        res.render('error', { errorMessage: "Internal Server Error" })
    }
}

const createCandidate = async (req, res) => {
    const { name, age, party, state } = req.body;
    try {
        if (!name || !age || !party || !state) {
            res.render('error', { errorMessage: "All fields are required" })
        }
        if (!req.file) {
            res.render('error', { errorMessage: "Image file not found" });
        }
        else {
            const imageUrl = await cloudinary.uploader.upload(req.file.path);
            const newCandidate = new Candidate({
                name: name.toLowerCase(),
                age: parseInt(age),
                party: party,
                state: state.toLowerCase(),
                image: imageUrl.url
            });
            await newCandidate.save();
            res.render('adminHome');
        }
    } catch (error) {
        res.render('error', { errorMessage: `Internal Server Error: ${error}` })
    }
}

const deleteCandidate = async (req, res) => {
    try {
        const { candidateId, name } = req.body;
        if (!candidateId || !name) {
            res.render('error', { errorMessage: "All fields are required" });
        } else {
            const result = await Candidate.findByIdAndDelete(candidateId);
            if (!result) {
                res.render('error', { errorMessage: "Error to delete the candidate" })
            } else {
                res.render('deleteSuccess');
            }
        }
    } catch (error) {
        res.render('error', { errorMessage: "Internal Server Error" })
    }
}

module.exports = {
    adminLogin,
    createCandidate,
    deleteCandidate
}