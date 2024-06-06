const mongoose = require("mongoose"),
  url =
    "mongodb+srv://mediaVault:tqGBgP9GCvPka9xy@cluster0.aginiik.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
