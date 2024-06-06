const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { verifyToken } = require('../middleware/authMiddleware');
const Media = require('../models/Media'); // Assuming you have a Media model
const router = express.Router();

// Configure Multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage: storage });

// Media upload endpoint for images
router.post('/uploadImage', verifyToken, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded." });
        }
        const newMedia = new Media({
            userId: req.user.user_id,
            filePath: req.file.path,
            fileName: req.file.filename,
            mimeType: req.file.mimetype,
        });
        await newMedia.save();
        res.status(201).json({ filePath: req.file.path });
    } catch (error) {
        res.status(500).json({ message: "Error uploading media.", error });
    }
});

// Bulk image upload endpoint
router.post('/uploadBulkImage', verifyToken, upload.array('images', 4), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No files uploaded." });
        }
        const mediaFiles = req.files.map(file => ({
            userId: req.user.user_id,
            filePath: file.path,
            fileName: file.filename,
            mimeType: file.mimetype,
        }));

        await Media.insertMany(mediaFiles);
        res.status(201).json({ message: "Images uploaded successfully.", files: req.files });
    } catch (error) {
        res.status(500).json({ message: "Error uploading images.", error });
    }
});

// Video upload endpoint
router.post('/uploadVideo', verifyToken, upload.single('video'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded." });
        }
        const allowedMimeTypes = ['video/mp4', 'video/x-matroska', 'video/x-msvideo', 'video/x-flv', 'video/quicktime'];
        if (!allowedMimeTypes.includes(req.file.mimetype)) {
            return res.status(400).json({ message: "Invalid file type." });
        }
        const newMedia = new Media({
            userId: req.user.user_id,
            filePath: req.file.path,
            fileName: req.file.filename,
            mimeType: req.file.mimetype,
        });
        await newMedia.save();
        res.status(201).json({ filePath: req.file.path });
    } catch (error) {
        res.status(500).json({ message: "Error uploading video.", error });
    }
});

// Get media files for logged-in user
router.get('/get-media', verifyToken, async (req, res) => {
    try {
        const mediaFiles = await Media.find({ userId: req.user.user_id });
        res.status(200).json(mediaFiles);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving media files.", error });
    }
});

// Serve media file by ID
router.get('/media/:id', verifyToken, async (req, res) => {
    try {
        const media = await Media.findById(req.params.id);
        if (!media || media.userId.toString() !== req.user.user_id) {
            return res.status(404).json({ message: "Media not found or unauthorized." });
        }

        const filePath = path.join(__dirname, '..', media.filePath);
        res.sendFile(filePath);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving media file.", error });
    }
});

// Delete a media file
router.delete('/del-media/:id', verifyToken, async (req, res) => {
    try {
        const media = await Media.findById(req.params.id);
        if (!media || media.userId.toString() !== req.user.user_id) {
            return res.status(404).json({ message: "Media not found or unauthorized." });
        }
        const filePath = path.join(__dirname, '..', media.filePath);
        fs.unlink(filePath, async (err) => {
            if (err) {
                return res.status(500).json({ message: "Error deleting file.", err });
            }
            await Media.deleteOne({ _id: req.params.id });
            res.status(200).json({ message: "Media deleted successfully." });
        });
    } catch (error) {
        res.status(500).json({ message: "Error deleting media.", error });
    }
});


module.exports = router;
