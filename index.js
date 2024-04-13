const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const mongoose = require('mongoose');
const cluster = require('node:cluster');
const os = require('os');
const totalCPU = os.cpus().length;

require("dotenv").config();


// if (cluster.isPrimary) {
//     for (let i = 0; i < totalCPU; i++) {
//         cluster.fork();
//     }
// } else {
mongoose.connect(process.env.DB_URI).then(() => console.log("Database connected...")).catch(() => console.log("Database connection error..."));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Signup and login a user...
app.use('/api/v1/user', require('./router/userRouter'));

app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log("Server connection error...");
    } else {
        console.log(`Server connected on port ${process.env.PORT}`);
    }
});
// }
