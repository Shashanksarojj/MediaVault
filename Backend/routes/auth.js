const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');

const JWT_SECRET = 'TygjhshdtQik898948433njsh';

// test-route
// router.get('/test', (req, res) => {
//     res.send("API is working");
// });

router.post('/register', async (req, res) => {
    try {
        const { username, password, name } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword, name });
        await newUser.save();
        res.status(201).json({ status: "success", message: "User registered successfully." });
    } catch (error) {
        res.status(500).json({ message: "Error registering user.", error });
    }
});

router.post('/login', async (req, res) => {
    try {
        // console.log("Login Called!")
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: "Invalid username or password." });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ message: "Invalid username or password." });

        const token = jwt.sign({ user_id: user._id }, JWT_SECRET);
        user.token = token;
        await user.save();

        res.json({ status: "success", username, token });
    } catch (error) {
        res.status(500).json({ message: "Error logging in.", error });
    }
});

// Route to verify JWT token
router.get('/verify-token', verifyToken, (req, res) => {
    console.log("token")
    res.json({ status: "success", message: "Token is valid.", userId: req.userId });
});

module.exports = router;
