const mongoose = require("../dbconnection/db");

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    token: { type: String }
});

module.exports = mongoose.model('User', UserSchema);
