const multer = require("multer");
const path = require("path");

// Store uploaded files temporarily in memory.
// The image will be sent directly to Cloudinary.
const storage = multer.memoryStorage();

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