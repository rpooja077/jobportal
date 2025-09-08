/**
 * User Controller
 * 
 * This controller handles all user-related operations including:
 * - User registration and authentication
 * - Profile management
 * - Email verification with OTP
 * - Session management
 */

// Import required modules
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import { uploadFile } from "../utils/cloud.js";
import { generateOTP, sendOTPEmail, sendWelcomeEmail } from "../utils/email.js";
import fs from "fs";
import path from "path";

/**
 * Register a new user
 * POST /api/users/register
 * 
 * @param {Object} req - Express request object containing user details in body
 * @param {string} req.body.fullname - User's full name
 * @param {string} req.body.email - User's email address
 * @param {string} req.body.phoneNumber - User's phone number
 * @param {string} req.body.password - User's password
 * @param {string} req.body.adharcard - User's Aadhar card number
 * @param {string} req.body.pancard - User's PAN card number
 * @param {string} req.body.role - User's role (Student/Recruiter/Admin)
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success/error message and user data
 */
export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, adharcard, pancard, role } = req.body;

    if (!fullname || !email || !phoneNumber || !password || !role || !pancard || !adharcard) {
      return res.status(400).json({
        message: "Missing required fields",
        success: false,
      });
    }

    // Name validation
    const nameRegex = /^[a-zA-Z\s]+$/;
    const trimmedName = fullname.trim();
    
    if (!trimmedName) {
      return res.status(400).json({
        message: "Full name is required",
        success: false,
      });
    }

    if (trimmedName.length < 2) {
      return res.status(400).json({
        message: "Full name must be at least 2 characters long",
        success: false,
      });
    }

    if (!nameRegex.test(trimmedName)) {
      return res.status(400).json({
        message: "Full name can only contain letters and spaces",
        success: false,
      });
    }

    if (/^\s+$/.test(fullname)) {
      return res.status(400).json({
        message: "Full name cannot be only spaces",
        success: false,
      });
    }

    if (/^\d+$/.test(trimmedName)) {
      return res.status(400).json({
        message: "Full name cannot be only numbers",
        success: false,
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        message: "Please enter a valid email address",
        success: false,
      });
    }

    // Phone validation
    const phoneRegex = /^[6-9][0-9]{9}$/;
    if (!phoneRegex.test(phoneNumber.trim())) {
      return res.status(400).json({
        message: "Please enter a valid 10-digit Indian mobile number",
        success: false,
      });
    }

    // PAN validation
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(pancard.trim().toUpperCase())) {
      return res.status(400).json({
        message: "Please enter a valid PAN card number",
        success: false,
      });
    }

    // Aadhaar validation
    const aadhaarRegex = /^[0-9]{12}$/;
    if (!aadhaarRegex.test(adharcard.trim())) {
      return res.status(400).json({
        message: "Please enter a valid 12-digit Aadhaar number",
        success: false,
      });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "Email already exists",
        success: false,
      });
    }

    const existingAdharcard = await User.findOne({ adharcard });
    if (existingAdharcard) {
      return res.status(400).json({
        message: "Adhar number already exists",
        success: false,
      });
    }

    const existingPancard = await User.findOne({ pancard });
    if (existingPancard) {
      return res.status(400).json({
        message: "Pan number already exists",
        success: false,
      });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({
        message: "Profile image is required",
        success: false,
      });
    }

    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.log("⚠️ Cloudinary not configured - using local file storage");
      
      // Save file locally instead of Cloudinary
      const fileName = `${Date.now()}_${file.originalname}`;
      const filePath = path.join(process.cwd(), 'uploads', fileName);
      
      // Ensure uploads directory exists
      if (!fs.existsSync(path.join(process.cwd(), 'uploads'))) {
        fs.mkdirSync(path.join(process.cwd(), 'uploads'), { recursive: true });
      }
      
      fs.writeFileSync(filePath, file.buffer);
      const profilePhotoUrl = `/uploads/${fileName}`;
      
      const hashedPassword = await bcrypt.hash(password, 10);

      // Generate OTP for email verification
      const otp = generateOTP();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      const newUser = new User({
        fullname,
        email,
        phoneNumber,
        adharcard,
        pancard,
        password: hashedPassword,
        role,
        profile: {
          profilePhoto: profilePhotoUrl,
        },
        emailVerificationOTP: otp,
        emailVerificationExpiry: otpExpiry,
        isEmailVerified: false,
      });

      await newUser.save();

      return res.status(201).json({
        message: `Account created successfully for ${fullname}. Please check your email for verification OTP.`,
        success: true,
        emailSent: true,
      });
    }

    // Use Cloudinary if configured
    const fileUri = getDataUri(file);
    const cloudResponse = await uploadFile(fileUri);

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP for email verification
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const newUser = new User({
      fullname,
      email,
      phoneNumber,
      adharcard,
      pancard,
      password: hashedPassword,
      role,
      profile: {
        profilePhoto: cloudResponse.secure_url,
      },
      emailVerificationOTP: otp,
      emailVerificationExpiry: otpExpiry,
      isEmailVerified: false,
    });

    await newUser.save();

    // Send OTP email
    const emailResult = await sendOTPEmail(email, otp, fullname);
    
    if (!emailResult.success) {
      console.error('Failed to send OTP email:', emailResult.error);
      // Still create user but notify about email issue
      return res.status(201).json({
        message: `Account created successfully for ${fullname}. Please check your email for verification OTP. If you don't receive the email, please contact support.`,
        success: true,
        emailSent: false,
      });
    }

    return res.status(201).json({
      message: `Account created successfully for ${fullname}. Please check your email for verification OTP.`,
      success: true,
      emailSent: true,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Server Error registration failed",
      success: false,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Verify user's email using OTP
 * POST /api/users/verify-email
 * 
 * @param {Object} req - Express request object with email and OTP
 * @param {string} req.body.email - User's email address
 * @param {string} req.body.otp - One-time password sent to user's email
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with verification status
 */
export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        message: "Email is already verified",
        success: false,
      });
    }

    if (user.emailVerificationOTP !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
        success: false,
      });
    }

    if (new Date() > user.emailVerificationExpiry) {
      return res.status(400).json({
        message: "OTP has expired. Please request a new one.",
        success: false,
      });
    }

    // Mark email as verified
    user.isEmailVerified = true;
    user.emailVerificationOTP = undefined;
    user.emailVerificationExpiry = undefined;
    await user.save();

    // Send welcome email
    await sendWelcomeEmail(email, user.fullname);

    return res.status(200).json({
      message: "Email verified successfully! Welcome to Job Portal.",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error email verification failed",
      success: false,
    });
  }
};

/**
 * Resend OTP to user's email
 * POST /api/users/resend-otp
 * 
 * @param {Object} req - Express request object with user's email
 * @param {string} req.body.email - User's email address
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with OTP resend status
 */
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        message: "Email is already verified",
        success: false,
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.emailVerificationOTP = otp;
    user.emailVerificationExpiry = otpExpiry;
    await user.save();

    // Send new OTP email
    const emailResult = await sendOTPEmail(email, otp, user.fullname);
    
    if (!emailResult.success) {
      return res.status(500).json({
        message: "Failed to send OTP email. Please try again later.",
        success: false,
      });
    }

    return res.status(200).json({
      message: "New OTP sent to your email successfully.",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error resend OTP failed",
      success: false,
    });
  }
};

/**
 * User login with email and password
 * POST /api/users/login
 * 
 * @param {Object} req - Express request object with login credentials
 * @param {string} req.body.email - User's email address
 * @param {string} req.body.password - User's password
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with authentication token and user data
 */
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Missing required fields",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    if (user.role !== role) {
      return res.status(403).json({
        message: "You don't have the necessary role to access this resource",
        success: false,
      });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: "Please verify your email address before logging in. Check your email for OTP or request a new one.",
        success: false,
        emailNotVerified: true,
      });
    }

    const tokenData = {
      userId: user._id,
      role: user.role || 'Student' // Include role in token with default to 'Student'
    };
    const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const sanitizedUser = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      adharcard: user.adharcard,
      pancard: user.pancard,
      role: user.role,
      profile: user.profile,
      isEmailVerified: user.isEmailVerified,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "Strict",
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        user: sanitizedUser,
        success: true,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error login failed",
      success: false,
    });
  }
};

/**
 * Logout user by clearing the authentication token
 * POST /api/users/logout
 * 
 * @param {Object} req - Express request object with user ID in request
 * @param {string} req.id - User ID from authentication middleware
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with logout status
 */
export const logout = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", {
        expires: new Date(Date.now()),
        httpOnly: true,
        sameSite: "Strict",
      })
      .json({
        message: "User logged out successfully",
        success: true,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error logout failed",
      success: false,
    });
  }
};

/**
 * Get current authenticated user's profile
 * GET /api/users/me
 * 
 * @param {Object} req - Express request object with user ID in request
 * @param {string} req.id - User ID from authentication middleware
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with user profile data
 */
export const getMe = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const sanitizedUser = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      adharcard: user.adharcard,
      pancard: user.pancard,
      role: user.role,
      profile: user.profile,
      isEmailVerified: user.isEmailVerified,
    };

    return res.status(200).json({
      message: "User data retrieved successfully",
      user: sanitizedUser,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error getting user data",
      success: false,
    });
  }
};

/**
 * Update user profile information
 * PUT /api/users/update-profile
 * 
 * @param {Object} req - Express request object with updated profile data
 * @param {string} req.id - User ID from authentication middleware
 * @param {Object} req.body - Updated user data (name, email, phone, etc.)
 * @param {Object} req.file - Optional profile picture file
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with updated user data
 */
export const updateProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, skills } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // One-time sanitize: if an old non-image URL was stored as profilePhoto, clear it
    if (user.profile?.profilePhoto) {
      const badPhoto = [".pdf", ".doc", ".docx", ".txt", "/resumes/"]
        .some(ext => user.profile.profilePhoto.toLowerCase().includes(ext));
      if (badPhoto) {
        user.profile.profilePhoto = "";
      }
    }

    // Handle resume upload if file is provided (Students only)
    if (req.files && req.files.resume && user.role === 'Student') {
      const fileUri = getDataUri(req.files.resume[0]);
      const cloudResponse = await uploadFile(fileUri);
      
      user.profile.resume = cloudResponse.secure_url;
      user.profile.resumeOriginalname = req.files.resume[0].originalname;
    }

    // Handle profile photo upload if provided
    if (req.files && req.files.profilePhoto) {
      const profilePhotoFile = req.files.profilePhoto[0];
      console.log('Profile photo upload detected:', profilePhotoFile.originalname);
      
      // Check if it's actually an image file
      if (!profilePhotoFile.mimetype.startsWith('image/')) {
        console.log('❌ Invalid file type for profile photo:', profilePhotoFile.mimetype);
        return res.status(400).json({
          message: "Profile photo must be an image file (JPG, PNG, GIF, etc.)",
          success: false
        });
      }
      
      const fileUri = getDataUri(profilePhotoFile);
      // Pass original filename so uploader treats images as images
      const cloudResponse = await uploadFile(fileUri, profilePhotoFile.originalname);
      
      user.profile.profilePhoto = cloudResponse.secure_url;
      console.log('✅ Profile photo URL saved:', user.profile.profilePhoto);
    }

    // Update other profile fields
    if (bio !== undefined) user.profile.bio = bio;
    if (skills !== undefined) user.profile.skills = skills;

    await user.save();

    // Return updated user data
    const updatedUser = await User.findById(userId).select('-password -emailVerificationOTP -emailVerificationExpiry');
    
    console.log('Sending updated user data:', {
      userId: updatedUser._id,
      profilePhoto: updatedUser.profile?.profilePhoto,
      fullProfile: updatedUser.profile
    });

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error profile update failed",
      success: false,
    });
  }
};
