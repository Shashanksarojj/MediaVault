const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyToken = async (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader) return res.status(401).json({ message: "No token provided." });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token is missing." });

    try {
        const decoded = jwt.verify(token, 'TygjhshdtQik898948433njsh');
        const userdata = await User.findById(decoded.user_id).lean();
        if (!userdata || token !== userdata.token) {
            return res.status(401).json({ message: "Invalid token." });
        }
        req.user = decoded;
        next();
    } catch (err) {
        console.error("Token verification error:", err);
        res.status(403).json({ message: "Invalid token." });
    }
};

module.exports = { verifyToken };
