const express = require('express');
const multer = require("multer");
const path = require('path');
const multerS3 = require("multer-s3");
require('dotenv').config();
const app = express(),
    cors = require("cors");
const authRoutes = require('./routes/auth');
const mediaRoutes = require('./routes/media');
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser")
const mongoose = require("mongoose")


// app.use(express.json());


app.options("", cors({
    origin: ["*"],
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
}))
app.use(
    cors({
        origin: ["*"],
        methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    })
);

// Middleware to parse JSON in the request body
https: app.use(express.json());

// Middleware to parse JSON in the response body
app.use(bodyParser.json());


app.get("/", (req, res) => {
    res.send("Hello People");
});


app.use('/api/auth', authRoutes);
app.use('/api/media', mediaRoutes);

app.listen(port, () => {
    console.log('Server is up on port ' + port);
})