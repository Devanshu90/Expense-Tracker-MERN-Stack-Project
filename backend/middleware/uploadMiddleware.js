const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Profile image upload directory
const uploadDir = path.join(__dirname, "..", "uploads", "profile");

// Create the directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure where files are stored
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname).toLowerCase();
        const filename = `profile-${Date.now()}${extension}`;

        cb(null, filename);
    },
});

// Allow only image files
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extension = path.extname(file.originalname).toLowerCase();
    const mimeType = allowedTypes.test(file.mimetype);

    if (mimeType && allowedTypes.test(extension)) {
        cb(null, true);
    } else {
        cb(new Error("Only JPG, JPEG, PNG, and WEBP images are allowed"));
    }
};

// Configure Multer
const uploadProfileImage = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
    },
});

module.exports = uploadProfileImage;