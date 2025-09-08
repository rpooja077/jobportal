/**
 * User Routes
 * 
 * Defines all API endpoints for user-related operations
 * Base URL: /api/users
 */

import express from "express";
import { 
  register, login, logout, getMe, updateProfile, verifyEmail, resendOTP 
} from "../controllers/user.controller.js";
import authenticateToken from "../middleware/isAuthenticated.js";
import { singleUpload, resumeUpload, profileUpdateUpload } from "../middleware/multer.js";
import path from "path";
import fs from "fs";

// Create an Express router
const router = express.Router();

/**
 * Test endpoint to verify the route is working
 * 
 * Returns a JSON response with a success message
 */
router.get("/test", (req, res) => {
  res.json({ message: "User routes are working", success: true });
});

// Test update-profile endpoint without middleware
router.put("/test-update", (req, res) => {
  console.log('Test update route hit');
  console.log('Request body:', req.body);
  console.log('Request headers:', req.headers);
  res.json({ message: "Test update route working", success: true });
});

/**
 * Public Routes (No Authentication Required)
 */

/**
 * @route POST /api/users/register
 * @description Register a new user
 * @access Public
 * @param {string} fullname - User's full name
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @param {string} phoneNumber - User's phone number
 * @param {file} [profilePicture] - Optional profile picture upload
 */
router.post("/register", singleUpload, register);

/**
 * @route POST /api/users/login
 * @description Authenticate user and get JWT token
 * @access Public
 * @param {string} email - User's email
 * @param {string} password - User's password
 */
router.post("/login", login);

/**
 * @route POST /api/users/logout
 * @description Logout user by clearing JWT cookie
 * @access Public
 */
router.post("/logout", logout);

/**
 * @route POST /api/users/verify-email
 * @description Verify user's email with OTP
 * @access Public
 * @param {string} email - User's email
 * @param {string} otp - One-time password received via email
 */
router.post("/verify-email", verifyEmail);

/**
 * @route POST /api/users/resend-otp
 * @description Resend OTP for email verification
 * @access Public
 * @param {string} email - User's email to resend OTP
 */
router.post("/resend-otp", resendOTP);

/**
 * Protected Routes (Authentication Required)
 * All routes below this point require a valid JWT token
 */

/**
 * @route GET /api/users/me
 * @description Get current authenticated user's profile
 * @access Private
 * @header Authorization: Bearer <token>
 */
router.get("/me", authenticateToken, getMe);

/**
 * @route PUT /api/users/update-profile
 * @description Update current user's profile information
 * @access Private
 * @header Authorization: Bearer <token>
 * @param {string} [fullname] - Updated full name
 * @param {string} [email] - Updated email
 * @param {string} [phoneNumber] - Updated phone number
 * @param {string} [bio] - Updated bio text
 * @param {string[]} [skills] - Array of skills
 * @param {file} [profilePicture] - New profile picture
 */
router.put("/update-profile", authenticateToken, profileUpdateUpload, updateProfile);

/**
 * @route PUT /api/users/debug-update
 * @description Debug endpoint for testing update operations
 * @access Public (Development only)
 * @deprecated This is a development-only endpoint and should be removed in production
 */
router.put("/debug-update", (req, res) => {
  console.log('Debug update route hit');
  res.json({ message: "Debug route working", success: true });
});

/**
 * @route GET /api/users/profile-photo/:filename
 * @description Serve user profile photos with proper content type and caching
 * @access Public
 * @param {string} filename - Name of the image file to serve
 * @returns {file} The requested image file or 404 if not found
 */
router.get("/profile-photo/:filename", (req, res) => {
  const filename = req.params.filename;
  const uploadsDir = path.join(process.cwd(), 'uploads');
  const filePath = path.join(uploadsDir, filename);
  
  // Security: Prevent directory traversal attacks
  if (!filePath.startsWith(uploadsDir)) {
    return res.status(400).json({ 
      success: false,
      message: "Invalid file path" 
    });
  }

  // Check if file exists
  if (fs.existsSync(filePath)) {
    // Determine content type based on file extension
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp'
    };
    
    // Set content type if extension is recognized, default to octet-stream
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    
    // Set headers for caching and security
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
    
    // Security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    // Send the file
    res.sendFile(filePath);
  } else {
    // File not found
    res.status(404).json({ 
      success: false,
      message: 'Profile photo not found' 
    });
  }
});

export default router;