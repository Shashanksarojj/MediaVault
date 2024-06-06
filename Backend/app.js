const express = require('express');
const multer = require("multer");
const path = require('path');
const app = express();
const authRoutes = require('./routes/auth');
const mediaRoutes = require('./routes/media');
const port = process.env.PORT || 3000;
const mongoose = require("mongoose")

app.use(express.json());

const imageStorage = multer.diskStorage({
    // Destination to store image     
    destination: 'images',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now()
            + path.extname(file.originalname))
        // file.fieldname is name of the field (image)
        // path.extname get the uploaded file extension
    }
});

// mongoose.connect('mongodb+srv://mediaVault:tqGBgP9GCvPka9xy@cluster0.aginiik.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });

app.get("/", (req, res) => {
    res.send("Hello People");
});


app.use('/auth', authRoutes);
app.use('/media', mediaRoutes);

app.listen(port, () => {
    console.log('Server is up on port ' + port);
})