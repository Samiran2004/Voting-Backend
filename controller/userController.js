const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const sendMail = require('../services/mailService');
const { response } = require('express');
const jwt = require('jsonwebtoken');

function getSignup(req, res) {
    res.render('signup')
};
const signUp = async (req, res) => {
    const { name, email, phone, address, aadhar, age, password, role } = req.body;

    try {
        //Check all required fields...
        if (!name || !email || !phone || !address || !aadhar || !age || !password || !role) {
            res.render('error', { errorMessage: "All fields are required." })
        } else {
            //Check the user is alredy exist in database or not
            const checkUser = await User.findOne({ addharCardNumber: aadhar });
            if (checkUser) {
                res.render('error', { errorMessage: "This user is already registered. Please go back to the home page and login." });
            } else {
                //Hash the password...
                const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(password, salt);

                //Convert the username to lowercase...
                const lowercaseName = name.toLowerCase();
                const newUser = new User({
                    name: lowercaseName,
                    age: parseInt(age),
                    email: email,
                    mobile: parseInt(phone),
                    address: address,
                    addharCardNumber: parseInt(aadhar),
                    password: hashedPassword,
                    role: role
                });
                await newUser.save();

                //Send a email...
                const text = `

                Dear ${name},
                
                We are thrilled to inform you that your signup process for our application has been successfully completed! 🎉
                
                Here at Unique-Vote, we are dedicated to providing you with a seamless and user-friendly experience, and we're excited to have you on board.
                
                With your signup complete, you now have access to all the features and functionalities of our application. Whether you're a voter or an admin, you can now explore and engage with our platform to its fullest extent.
                
                As a registered member, you'll be able to:
                
                Cast your vote in various polls and elections.
                Create and manage your own polls.
                Stay updated with the latest news and announcements.
                Connect with other members of the community.
                If you have any questions or need assistance, our support team is here to help. Feel free to reach out to us at [Your Contact Email] and we'll be happy to assist you.
                
                Thank you for choosing Unique-Vote. We look forward to serving you and providing you with an exceptional voting experience.
                
                Best regards,
                Unique-Vote Team`;
                const data = {
                    to: email,
                    subject: "Congratulations! Your Signup is Complete",
                    text: text
                }

                await sendMail(data, (error, response) => {
                    if (error) {
                        console.log(`Mail error ${error}`);
                    } else {
                        console.log("Mail send successful");
                    }
                });

                res.render('login');

            }
        }
    } catch (error) {
        res.render('error', { errorMessage: "Internal Server Error." })
    }
}

const login = async (req, res) => {
    try {
        const { aadhar, password } = req.body;

        if (!aadhar || !password) {
            res.render('error', { errorMessage: "All fields are required" });
        } else {
            //Check is this a valid aadhar number...
            const check = await User.findOne({ addharCardNumber: parseInt(aadhar) });
            if (check) {
                //Check Password is valid or not...
                const checkPassword = await bcrypt.compare(password, check.password);
                if (checkPassword) {
                    const payload = {
                        name: check.name,
                        age: check.age,
                        address: check.address,
                        role: check.role,
                        isVoted: check.isVoted
                    };
                    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
                    res.cookie('token', token).render('home');
                } else {
                    res.render('error', { errorMessage: "Aadhar or Password is Invalid" });
                }
            } else {
                res.render('error', { errorMessage: "Aadhar or Password is Invalid" });
            }
        }
    } catch (error) {
        res.render('error', { errorMessage: "Internal Server Error" })
    }
}

module.exports = {
    getSignup,
    signUp,
    login
}