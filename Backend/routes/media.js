
const express = require('express');
const multer = require('multer');
const { S3Client, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const multerS3 = require('multer-s3');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { verifyToken } = require('../middleware/authMiddleware');
const Media = require('../models/Media'); // Assuming you have a Media model
const router = express.Router();

// Configure AWS SDK
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const myBucket = process.env.AWS_BUCKET_NAME;

// Configure Multer storage for S3
const storage = multerS3({
    s3: s3Client,
    bucket: myBucket,
    acl: "bucket-owner-full-control",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
        cb(null, Date.now().toString() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Media upload endpoint for images
router.post('/uploadImage', verifyToken, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded." });
        }
        // Generate a pre-signed URL valid for 15 hours
        const params = {
            Bucket: myBucket,
            Key: req.file.key,
            Expires: 60 * 15, // 15 min in seconds
        };
        const url = await getSignedUrl(s3Client, new GetObjectCommand(params));

        const newMedia = new Media({
            userId: req.user.user_id,
            filePath: req.file.location,
            fileName: req.file.key,
            mimeType: req.file.mimetype,
        });
        await newMedia.save();
        res.status(201).json({ "status": 'success', "Imageurl15min": url });
    } catch (error) {
        res.status(500).json({ "status": 'failed', message: "Error uploading media.", error });
    }
});

// Bulk image upload endpoint
router.post('/uploadBulkImage', verifyToken, upload.array('images', 4), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No files uploaded." });
        }

        const params = {
            Bucket: myBucket,
            Key: req.files.key,
            Expires: 60 * 15, // 15 hours in seconds
        };
        const url = await getSignedUrl(s3Client, new GetObjectCommand(params));

        const mediaFiles = req.files.map(file => ({
            userId: req.user.user_id,
            filePath: file.location,
            fileName: file.key,
            mimeType: file.mimetype,
        }));

        await Media.insertMany(mediaFiles);
        res.status(201).json({ message: "Images uploaded successfully.", "signed-url": url });
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
            filePath: req.file.location,
            fileName: req.file.key,
            mimeType: req.file.mimetype,
        });
        await newMedia.save();
        res.status(201).json({ filePath: req.file.location });
    } catch (error) {
        res.status(500).json({ message: "Error uploading video.", error });
    }
});

// Get media files for logged-in user
router.get('/get-media', verifyToken, async (req, res) => {
    try {
        const mediaFiles = await Media.find({ userId: req.user.user_id });
        // Generate signed URLs for each media file
        const signedMediaFiles = await Promise.all(mediaFiles.map(async (media) => {
            const params = {
                Bucket: myBucket,
                Key: media.fileName,
                Expires: 60 * 15, // 24 hours in seconds (adjust as needed)
            };
            const url = await getSignedUrl(s3Client, new GetObjectCommand(params));
            return { ...media.toObject(), ImageUrl: url };
        }));


        res.status(200).json(signedMediaFiles);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving media files.", error });
    }
});



// // Get media files for logged-in user with Pagination
// router.get('/get-media', verifyToken, async (req, res) => {
//     try {
//         const mediaFiles = await Media.find({ userId: req.user.user_id });

//         if (!mediaFiles || mediaFiles.length === 0) {
//             return res.status(404).json({ message: "No media files found for the user." });
//         }

//         // Generate signed URLs for each media file
//         const signedMediaFiles = await Promise.all(mediaFiles.map(async (media) => {
//             const params = {
//                 Bucket: myBucket,
//                 Key: media.fileName,
//                 Expires: 60 * 15, // 15 minutes in seconds (adjust as needed)
//             };
//             const url = await getSignedUrl(s3Client, new GetObjectCommand(params));
//             return { ...media.toObject(), imageUrl: url };
//         }));

//         const totalMediaFiles = signedMediaFiles.length;
//         const totalPages = 1; // Since there's no pagination yet, assume only one page
//         const currentPage = 1; // Assume current page is 1

//         res.status(200).json({
//             totalMediaFiles: totalMediaFiles,
//             totalPages: totalPages,
//             currentPage: currentPage,
//             mediaFiles: signedMediaFiles
//         });
//     } catch (error) {
//         res.status(500).json({ message: "Error retrieving media files.", error });
//     }
// });

// Serve media file by ID
router.get('/media/:id', verifyToken, async (req, res) => {
    try {
        const media = await Media.findById(req.params.id);
        if (!media || media.userId.toString() !== req.user.user_id) {
            return res.status(404).json({ message: "Media not found or unauthorized." });
        }

        // Redirect to the S3 file URL
        const params = {
            Bucket: myBucket,
            Key: media.fileName,
        };
        const url = await getSignedUrl(s3Client, new GetObjectCommand(params));
        res.redirect(url);
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

        // console.log("Media Found!")
        const params = {
            Bucket: myBucket,
            Key: media.fileName
        };
        // console.log("Params: " + params);
        const command = new DeleteObjectCommand(params);
        // console.log("Command Created!")
        await s3Client.send(command);
        // console.log("Command Send!")
        await Media.deleteOne({ _id: req.params.id });
        res.status(200).json({ "status": "success", message: "Media deleted successfully." });
    } catch (error) {
        console.log("Error deleting!")
        res.status(500).json({ message: "Error deleting media.", error });
    }
});

module.exports = router;
