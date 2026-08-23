const User = require("../models/User");
const jwt = require("jsonwebtoken");

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

    // Validation: Check for missing fields
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

        // Create the user
        const user = await User.create({
            fullName,
            email,
            password,
            profileImageUrl: profileImageUrl || null,
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
        res.status(500).json({
            message: "Error getting user information",
            error: err.message,
        });
    }
};

// Upload Profile Image
exports.uploadProfileImage = async (req, res) => {
    try {
        // Make sure a file was uploaded
        if (!req.file) {
            return res.status(400).json({
                message: "No file uploaded",
            });
        }

        // Find the currently authenticated user
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        // Create the URL for the uploaded image
        const imageUrl = `${req.protocol}://${req.get("host")}/uploads/profile/${req.file.filename}`;

        // Save image URL to the user's MongoDB document
        user.profileImageUrl = imageUrl;

        await user.save();

        // Return updated user information
        res.status(200).json({
            message: "Profile image uploaded successfully",
            imageUrl,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                profileImageUrl: user.profileImageUrl,
            },
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