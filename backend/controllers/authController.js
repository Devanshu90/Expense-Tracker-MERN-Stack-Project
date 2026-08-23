const User = require("../models/User");
const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinary");

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

// Register User
exports.registerUser = async (req, res) => {
    const { fullName, email, password, profileImageUrl } = req.body;

    // Validation
    if (!fullName || !email || !password) {
        return res.status(400).json({
            message: "All fields are required",
        });
    }

    try {
        // Check if email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already in use",
            });
        }

        // Create user
        const user = await User.create({
            fullName,
            email,
            password,
            profileImageUrl,
        });

        res.status(201).json({
            id: user._id,
            user,
            token: generateToken(user._id),
        });
    } catch (err) {
        console.error("REGISTER ERROR:");
        console.error(err);

        res.status(500).json({
            message: "Error registering user",
            error: err.message,
        });
    }
};

// Login User
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "All fields are required",
        });
    }

    try {
        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({
                message: "Invalid credentials",
            });
        }

        res.status(200).json({
            id: user._id,
            user,
            token: generateToken(user._id),
        });
    } catch (err) {
        console.error("LOGIN ERROR:");
        console.error(err);

        res.status(500).json({
            message: "Error logging in",
            error: err.message,
        });
    }
};

// Get User Info
exports.getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        res.status(200).json(user);
    } catch (err) {
        console.error("GET USER INFO ERROR:");
        console.error(err);

        res.status(500).json({
            message: "Error getting user information",
            error: err.message,
        });
    }
};

// Upload Profile Image to Cloudinary
exports.uploadProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "No image file uploaded",
            });
        }

        // Upload image buffer to Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "expense-tracker/profile",
                    resource_type: "image",
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );

            uploadStream.end(req.file.buffer);
        });

        // Find logged-in user
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        // Save Cloudinary URL in MongoDB
        user.profileImageUrl = uploadResult.secure_url;

        await user.save();

        // Return updated user without password
        const updatedUser = await User.findById(user._id).select("-password");

        res.status(200).json({
            message: "Profile photo uploaded successfully",
            imageUrl: uploadResult.secure_url,
            user: updatedUser,
        });
    } catch (err) {
        console.error("PROFILE IMAGE UPLOAD ERROR:");
        console.error(err);

        res.status(500).json({
            message: "Error uploading profile image",
            error: err.message,
        });
    }
};