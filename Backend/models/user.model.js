/**
 * User Model
 * 
 * Defines the schema for user data in the database.
 * Includes validation for all fields to ensure data integrity.
 * 
 * Fields:
 * - fullname: User's full name (2-50 chars, letters and spaces only)
 * - email: Unique email address with format validation
 * - phoneNumber: 10-digit Indian phone number
 * - password: Hashed password (min 6 chars)
 * - pancard: 10-character PAN card number
 * - adharcard: 12-digit Aadhar card number
 * - role: User role (Student/Recruiter/Admin)
 * - isVerified: Boolean indicating if email is verified
 * - otp: One-time password for email verification
 * - otpExpiry: Expiry time for OTP
 * - profile: User profile information
 * - resume: User's resume URL
 * - skills: Array of user skills
 * - education: Array of education details
 * - experience: Array of work experience
 * - applications: Array of job applications
 * - savedJobs: Array of saved job IDs
 * - createdAt: Timestamp of user creation
 * - updatedAt: Timestamp of last update
 */

import mongoose from "mongoose";

// Define the user schema with all fields and validations
const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      validate: {
        validator: function(name) {
          // Name should be at least 2 characters and contain only letters and spaces
          const nameRegex = /^[a-zA-Z\s]{2,50}$/;
          return nameRegex.test(name);
        },
        message: 'Please enter a valid name (2-50 characters, only letters and spaces)'
      }
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function(email) {
          // Email format validation using regex
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(email);
        },
        message: 'Please enter a valid email address'
      }
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function(phone) {
          // Indian phone number validation (10 digits starting with 6,7,8,9)
          const phoneRegex = /^[6-9]\d{9}$/;
          return phoneRegex.test(phone);
        },
        message: 'Please enter a valid 10-digit Indian phone number'
      }
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function(pass) {
          // Password should be at least 6 characters
          return pass.length >= 6;
        },
        message: 'Password must be at least 6 characters long'
      }
    },
    pancard: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function(pan) {
          // PAN card validation - any 10 characters, trim whitespace
          if (!pan) return false;
          const trimmedPan = pan.toString().trim();
          return trimmedPan.length === 10;
        },
        message: 'Please enter a valid 10-character PAN card number'
      }
    },
    adharcard: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function(aadhar) {
          // Aadhar card validation (12 digits)
          const aadharRegex = /^\d{12}$/;
          return aadharRegex.test(aadhar);
        },
        message: 'Please enter a valid 12-digit Aadhar card number'
      }
    },
    role: {
      type: String,
      enum: ["Student", "Recruiter"],
      default: "Student",
      required: true,
    },
    profile: {
      bio: {
        type: String,
      },
      skills: [{ type: String }],
      resume: {
        type: String, // URL to resume file
      },
      resumeOriginalname: {
        type: String, // Original name of resume file
      },
      company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
      },
      profilePhoto: {
        type: String, // URL to profile photo file
        default: "",
      },
    },
    // Email verification fields
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationOTP: {
      type: String,
    },
    emailVerificationExpiry: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Pre-save middleware to format data before saving
userSchema.pre('save', function(next) {
  // Format PAN card to uppercase
  if (this.pancard) {
    this.pancard = this.pancard.toString().trim().toUpperCase();
  }
  
  // Format fullname to title case
  if (this.fullname) {
    this.fullname = this.fullname.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }
  
  next();
});

export const User = mongoose.model("User", userSchema);
