/**
 * Job Controller
 * 
 * This controller handles all job-related operations including:
 * - Job posting and management (Admin)
 * - Retrieving job listings
 * - Job application processing
 * - Job search and filtering
 */

import { Job } from "../models/job.model.js";

/**
 * Post a new job (Admin only)
 * POST /api/jobs/post
 * 
 * @param {Object} req - Express request object containing job details in body
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success/error message
 */
export const postJob = async (req, res) => {
  try {
    console.log('📝 Job posting request received:', req.body);
    
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
    } = req.body;
    const userId = req.id;

    console.log('🔍 Validating job data...');
    console.log('User ID:', userId);
    console.log('Company ID:', companyId);

    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !position ||
      !companyId
    ) {
      console.log('❌ Missing required fields');
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }
    console.log('✅ All validations passed, creating job...');
    
    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(","),
      salary: salary,
      location,
      jobType,
      experienceLevel: Number(experience),
      position: Number(position),
      company: companyId,
      created_by: userId,
    });
    
    console.log('🎉 Job created successfully:', job._id);
    
    res.status(201).json({
      message: "Job posted successfully.",
      job,
      status: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", status: false });
  }
};

//Users
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };
    const jobs = await Job.find(query)
      .populate({
        path: "company",
        select: "name description website location logo"
      })
      .sort({ createdAt: -1 });

    if (!jobs) {
      return res.status(404).json({ message: "No jobs found", status: false });
    }
    return res.status(200).json({ jobs, status: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", status: false });
  }
};

//Users
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    
    // Validate jobId
    if (!jobId || jobId === 'undefined') {
      return res.status(400).json({ message: "Invalid job ID", status: false });
    }
    
    console.log('Fetching job with ID:', jobId);
    
    const job = await Job.findById(jobId)
      .populate({
        path: "company",
        select: "name description website location logo"
      })
      .populate({
        path: "applications",
      });
      
    if (!job) {
      return res.status(404).json({ message: "Job not found", status: false });
    }
    
    console.log('Job found:', job._id);
    return res.status(200).json({ job, status: true });
  } catch (error) {
    console.error('getJobById error:', error);
    return res.status(500).json({ message: "Server Error", status: false });
  }
};

/**
 * Get all jobs (Admin only)
 * GET /api/jobs/admin/get
 * 
 * @param {Object} req - Express request object (requires admin authentication)
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with all jobs including inactive ones
 */
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;
    const jobs = await Job.find({ created_by: adminId }).populate({
      path: "company",
      select: "name description website location logo",
      sort: { createdAt: -1 },
    });
    if (!jobs) {
      return res.status(404).json({ message: "No jobs found", status: false });
    }
    return res.status(200).json({ jobs, status: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", status: false });
  }
};

/**
 * Update job details
 * PUT /api/jobs/update/:id
 * 
 * @param {Object} req - Express request object with job ID in params and update data in body
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with updated job data
 */
export const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const adminId = req.id;
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
    } = req.body;

    // Check if all required fields are provided
    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !position ||
      !companyId
    ) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    // Find the job and check if it belongs to the current admin
    const existingJob = await Job.findOne({ _id: jobId, created_by: adminId });
    
    if (!existingJob) {
      return res.status(404).json({
        message: "Job not found or you don't have permission to edit it",
        success: false,
      });
    }

    // Update the job
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      {
        title,
        description,
        requirements: requirements.split(","),
        salary: Number(salary),
        location,
        jobType,
        experienceLevel: experience,
        position,
        company: companyId,
      },
      { new: true, runValidators: true }
    ).populate("company");

    res.status(200).json({
      message: "Job updated successfully.",
      job: updatedJob,
      status: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", status: false });
  }
};
