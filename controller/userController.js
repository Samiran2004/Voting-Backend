const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const sendMail = require('../services/mailService');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
    try {
        const {
            name,
            age,
            email,
            address,
            addharCardNumber,
            password,
            role,
            mobile
        } = req.body;

        // Check if all required fields are present
        if (!name || !age || !address || !addharCardNumber || !password || !mobile) {
            return res.status(400).send({
                status: "Failed",
                message: "All fields are required"
            });
        }

        //Check the length of addharcard number..
        const length = addharCardNumber.toString().length;
        if (length != 12) {
            res.status(400).send({
                status: "Failed",
                message: "Addhar number should be 12 digits"
            });
        } else {
            // Check if user is already registered in the database
            const checkUser = await User.findOne({ addharCardNumber });
            if (checkUser) {
                return res.status(409).send({
                    status: "Failed",
                    message: "User already exists"
                });
            }

            // Validate and normalize the role (convert to lowercase)
            const lowerCaseRole = role.toLowerCase();
            if (lowerCaseRole !== "voter" && lowerCaseRole !== "admin") {
                return res.status(400).send({
                    status: "Failed",
                    message: "Role should be voter or admin"
                });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create a new user object with the provided data
            const newUser = new User({
                name, age, email, mobile, addharCardNumber, password: hashedPassword, address, role: lowerCaseRole
            });

            // Save the new user to the database
            await newUser.save();

            // Send email if email address is provided
            if (email) {
                const data = {
                    to: email,
                    subject: "Registration Successful",
                    html: `<h1>Dear ${name}</h1><p> successfully registered</p>`
                }
                sendMail(data, (err, response) => {
                    if (err) {
                        console.error("Error sending email:", err);
                    }
                });
            }

            // Send success response
            res.status(201).send({
                status: "Success",
                message: "User created successfully"
            });
        }

    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({
            message: "Internal Server Error"
        });
    }
}

const login = async (req, res) => {
    try {
        const { addharCardNumber, password } = req.body;

        // Check if all required fields are present...
        if (!addharCardNumber || !password) {
            res.status(400).send({
                status: "Failed",
                message: "All fields are required"
            });
        } else {
            //Check the user...
            const userData = await User.findOne({ addharCardNumber: addharCardNumber });
            if (userData) {
                //Check password is valid or not....
                const checkPassword = await bcrypt.compare(password, userData.password);
                if (!checkPassword) {
                    res.status(400).send({
                        status: "Failed",
                        message: "Addhar number or password is not valid"
                    });
                } else {
                    const payload = {
                        username: userData.name,
                        age: userData.age,
                        role: userData.role
                    }
                    //Create a JWT token...
                    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 });

                    // Set the expiration time of the cookie.
                    // Here, 3600 * 1000 calculates the expiration time in milliseconds,
                    // which represents 3600 seconds (1 hour) from the current time (Date.now()).
                    res.cookie("token", token, {
                        httpOnly: true,
                        sameSite: "lax", // Protects against CSRF attacks
                        expires: new Date(Date.now() + 3600 * 1000)
                    });
                    res.status(200).send({
                        status: "OK",
                        message: "Login successful",
                        token
                    });
                }
            }
        }
    } catch (error) {
        res.status(500).send({
            status: "Failed",
            message: "Internal Server error"
        });
    }
}

module.exports = {
    signup,
    login
}
