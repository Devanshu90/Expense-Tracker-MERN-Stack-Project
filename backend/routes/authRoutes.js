const express = require("express");

const { protect } = require("../middleware/authMiddleware");

const {
    registerUser,
    loginUser,
    getUserInfo,
    uploadProfileImage,
} = require("../controllers/authController");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Get logged-in user
router.get("/getUser", protect, getUserInfo);

// Upload profile image
router.post(
    "/upload-image",
    protect,
    upload.single("image"),
    uploadProfileImage
);

module.exports = router;