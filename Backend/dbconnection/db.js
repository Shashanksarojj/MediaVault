require('dotenv').config();
const mongoose = require("mongoose"),
  url =
    process.env.MONGO_CREDENTIALS;

mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to the database ");
  })
  .catch((err) => {
    console.error(`Error connecting to the database. n${err}`);
  });
// mongoose.set('debug', true);
module.exports = mongoose;
