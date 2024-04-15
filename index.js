const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const mongoose = require('mongoose');
const path = require('node:path');
const auth = require('./middleware/authMiddleware');

require("dotenv").config();

// Connect to MongoDB
mongoose.connect(process.env.DB_URI).then(() => console.log("Database connected...")).catch(() => console.log("Database connection error..."));

// Set view engine and views directory
app.set('view engine', 'ejs');
app.set('views', './views');

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(auth('token'));
app.use(express.static(path.resolve('./public')));

// Routes
app.use('/', require('./router/serveRouter'));
app.use('/user', require('./router/userRouter'));
app.use('/admin',require('./router/adminRouter'));

// Logout route
app.get('/logout', (req, res) => {
    res.clearCookie('token'); // Clear token cookie
    res.redirect('/'); // Redirect to home page or login page
});


// Error handling middleware
app.use((err, req, res, next) => {
    if (err instanceof Error && err.name === 'TooManyRequests') {
        return res.status(429).render('rate_limit_error', { message: err.message });
    }
    next(err);
});

// Start the server
app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log("Server connection error...");
    } else {
        console.log(`Server connected on port ${process.env.PORT}`);
    }
});
