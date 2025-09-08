/**
 * Company Routes
 * 
 * This file defines all the API routes related to company operations.
 * All routes are protected with JWT authentication middleware.
 * File uploads are handled using multer middleware.
 */

import express from "express";
// Authentication middleware
import authenticateToken from "../middleware/isAuthenticated.js";
// Controller functions
import {
  registerCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
} from "../controllers/company.controller.js";
// File upload middleware
import { companyLogoUpload } from "../middleware/multer.js";

// Create Express router
const router = express.Router();

/**
 * @route   POST /api/companies/register
 * @desc    Register a new company
 * @access  Private (requires authentication)
 */
router.route("/register").post(authenticateToken, registerCompany);

/**
 * @route   GET /api/companies/get
 * @desc    Get all companies
 * @access  Private (requires authentication)
 */
router.route("/get").get(authenticateToken, getAllCompanies);

/**
 * @route   GET /api/companies/get/:id
 * @desc    Get company by ID
 * @access  Private (requires authentication)
 * @param   {string} id - Company ID
 */
router.route("/get/:id").get(authenticateToken, getCompanyById);

/**
 * @route   PUT /api/companies/update/:id
 * @desc    Update company information
 * @access  Private (requires authentication)
 * @param   {string} id - Company ID
 * @note    This route handles file uploads for company logos
 *          - Uses multer middleware for file handling
 *          - Supports both single file uploads
 */
router.route("/update/:id").put(
  // 1. Verify user is authenticated
  authenticateToken, 
  
  // 2. Log the start of the update process
  (req, res, next) => {
    console.log('🔍 Starting company update...');
    next();
  },
  
  // 3. Handle file upload using multer middleware
  companyLogoUpload, 
  
  // 4. Debug logging for file uploads (development only)
  (req, res, next) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('📦 Multer processed files:', req.files);
      console.log('📦 Multer processed file:', req.file);
      console.log('📦 Request body:', req.body);
    }
    next();
  },
  
  // 5. Process the update in the controller
  updateCompany
);

// Export the router for use in the main application
export default router;