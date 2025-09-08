/**
 * Company Controller
 * 
 * This controller handles all company-related operations including:
 * - Company registration
 * - Retrieving company data
 * - Updating company information
 * - Handling company logos and file uploads
 */

// Import required models and utilities
import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import { uploadFile } from '../utils/cloud.js';
import path from 'path';

/**
 * Register a new company
 * POST /api/companies/register
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success/error message
 */
export const registerCompany = async (req, res) => {
  try {
    // Extract company name from request body
    const { companyName } = req.body;
    
    // Validate input - ensure company name is provided and not just whitespace
    if (!companyName || !companyName.trim()) {
      return res.status(400).json({
        message: "Company name is required",
        success: false,
      });
    }

    // Check if user is authenticated (req.id is set by the auth middleware)
    if (!req.id) {
      return res.status(401).json({
        message: "Authentication required. Please login again.",
        success: false,
      });
    }

    // Check if company name already exists (case-insensitive search)
    // This prevents duplicate company names in the system
    const existingCompany = await Company.findOne({ 
      name: { $regex: new RegExp(`^${companyName.trim()}$`, 'i') } 
    });
    
    if (existingCompany) {
      return res.status(400).json({
        message: "A company with this name already exists. Please choose a different name.",
        success: false,
      });
    }

    // Check if user has already created too many companies (optional limit)
    const userCompanies = await Company.find({ userId: req.id });
    if (userCompanies.length >= 10) { // Allow up to 10 companies per user
      return res.status(400).json({
        message: "You can create up to 10 companies. Please contact support if you need more.",
        success: false,
      });
    }

    // Create new company
    const company = await Company.create({
      name: companyName.trim(),
      userId: req.id,
    });

    console.log(`Company created successfully: ${company.name} by user: ${req.id}`);

    return res.status(201).json({
      message: "Company registered successfully!",
      company,
      success: true,
    });
  } catch (error) {
    console.error("Company registration error:", error);
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      return res.status(400).json({
        message: "A company with this name already exists. Please choose a different name.",
        success: false,
      });
    }
    
    return res.status(500).json({
      message: "Internal server error. Please try again.",
      success: false,
    });
  }
};

/**
 * Get all companies
 * GET /api/companies/get
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with list of companies
 */
export const getAllCompanies = async (req, res) => {
  try {
    // Fetch all companies from database, sorted by creation date (newest first)
    const companies = await Company.find().sort({ createdAt: -1 });
    
    // Return companies list
    return res.status(200).json({
      companies,
      success: true,
    });
  } catch (error) {
    console.error("Error in getAllCompanies:", error);
    return res.status(500).json({
      message: "Failed to fetch companies. Please try again later.",
      success: false,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get company by ID
 * GET /api/companies/get/:id
 * 
 * @param {Object} req - Express request object with company ID in params
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with company data
 */
export const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate company ID
    if (!id) {
      return res.status(400).json({
        message: "Company ID is required",
        success: false,
      });
    }

    // Find company by ID
    const company = await Company.findById(id);
    
    // If company not found, return 404
    if (!company) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }

    // Return company data
    return res.status(200).json({
      company,
      success: true,
    });
  } catch (error) {
    console.error("Error in getCompanyById:", error);
    return res.status(500).json({
      message: "Failed to fetch company details. Please try again later.",
      success: false,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update company information
 * PUT /api/companies/update/:id
 * 
 * @param {Object} req - Express request object with company ID in params and update data in body
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with updated company data
 */
export const updateCompany = async (req, res) => {
  try {
    // Extract company data from request body
    const { name, description, website, location } = req.body;
    const companyId = req.params.id; // Get company ID from URL parameters
    const file = req.file; // Get uploaded file (if any) from multer middleware

    // Check if user is authenticated (req.id is set by auth middleware)
    if (!req.id) {
      return res.status(401).json({
        message: "Authentication required. Please login again.",
        success: false,
      });
    }

    // Find the company by ID
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }

    // Check if the authenticated user is the owner of the company
    if (company.userId.toString() !== req.id) {
      return res.status(403).json({
        message: "You can only update your own companies",
        success: false,
      });
    }

    // Prepare update data with the fields that should be updated
    const updateData = { name, description, website, location };

    // Handle logo upload if a file was provided in the request
    if (req.file) {
      const file = req.file;
      try {
        console.log('📁 File received:', file.originalname, file.mimetype, file.size);
        
        // Validate that the uploaded file is an image
        if (!file.mimetype.startsWith('image/')) {
          return res.status(400).json({
            message: "Only image files are allowed for company logo",
            success: false,
          });
        }

        // Check if Cloudinary is configured for cloud storage
        if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
          console.log('☁️ Uploading to Cloudinary...');
          // Convert file to data URI format required by Cloudinary
          const fileUri = getDataUri(file);
          // Upload file to Cloudinary
          const cloudResponse = await uploadFile(fileUri, file.originalname);
          // Store the secure URL returned by Cloudinary
          updateData.logo = cloudResponse.secure_url;
          console.log('✅ Cloudinary upload successful');
        } else {
          // Fallback to local file storage if Cloudinary is not configured
          console.log('💾 Using local file storage...');
          // Generate a unique filename to prevent conflicts
          const fileName = `company_logo_${Date.now()}_${file.originalname}`;
          const filePath = path.join(process.cwd(), 'uploads', fileName);
          
          // Ensure the uploads directory exists
          const fs = await import('fs');
          const uploadsDir = path.join(process.cwd(), 'uploads');
          if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
          }
          
          // Save the file to the local filesystem
          await fs.promises.writeFile(filePath, file.buffer);
          
          // Create a full URL for the uploaded file
          const serverUrl = process.env.SERVER_URL || 'http://localhost:4000';
          updateData.logo = `${serverUrl}/uploads/${fileName}`;
          console.log('✅ Local file saved:', updateData.logo);
        }
      } catch (uploadError) {
        console.error("Logo upload error:", uploadError);
        return res.status(500).json({
          message: "Failed to upload logo. Please try again.",
          success: false,
          error: process.env.NODE_ENV === 'development' ? uploadError.message : undefined
        });
      }
    }

    // Update the company document in the database with the new data
    const updatedCompany = await Company.findByIdAndUpdate(
      companyId,
      updateData,
      { 
        new: true, // Return the updated document
        runValidators: true // Run model validators on update
      }
    );

    // Return success response with the updated company data
    return res.status(200).json({
      message: "Company updated successfully",
      company: updatedCompany,
      success: true,
    });
  } catch (error) {
    console.error("Update company error:", error);
    return res.status(500).json({
      message: "An error occurred while updating the company. Please try again later.",
      success: false,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
