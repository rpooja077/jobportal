/**
 * Job Routes
 * 
 * This file defines all API endpoints related to job operations.
 * All routes are protected and require a valid JWT token.
 * 
 * Base URL: /api/jobs
 */

import express from "express";
import authenticateToken from "../middleware/isAuthenticated.js";
import {
  getAdminJobs,
  getAllJobs,
  getJobById,
  postJob,
  updateJob,
} from "../controllers/job.controller.js";

// Create an Express router
const router = express.Router();

/**
 * @route POST /api/jobs/post
 * @description Create a new job posting
 * @access Private (Recruiter/Admin only)
 * @header Authorization: Bearer <token>
 * @param {string} title - Job title
 * @param {string} description - Detailed job description
 * @param {string[]} requirements - Array of job requirements
 * @param {string} salary - Salary range or amount
 * @param {number} experienceLevel - Years of experience required
 * @param {string} location - Job location
 * @param {string} jobType - Type of employment (Full-time/Part-time/Contract/Internship)
 * @param {string[]} skills - Array of required skills
 * @param {string} deadline - Application deadline (ISO date string)
 */
router.route("/post").post(authenticateToken, postJob);

/**
 * @route GET /api/jobs/get
 * @description Get all active job listings
 * @access Private (Authenticated users)
 * @header Authorization: Bearer <token>
 * @query {string} [search] - Optional search term
 * @query {string} [location] - Optional location filter
 * @query {string} [jobType] - Optional job type filter
 * @query {string} [experience] - Optional experience level filter
 */
router.route("/get").get(authenticateToken, getAllJobs);

/**
 * @route GET /api/jobs/getadminjobs
 * @description Get all jobs (including inactive) - Admin only
 * @access Private (Admin only)
 * @header Authorization: Bearer <token>
 * @query {string} [status] - Optional status filter (active/inactive)
 */
router.route("/getadminjobs").get(authenticateToken, getAdminJobs);

/**
 * @route GET /api/jobs/get/:id
 * @description Get job details by ID
 * @access Private (Authenticated users)
 * @header Authorization: Bearer <token>
 * @param {string} id - Job ID
 */
router.route("/get/:id").get(authenticateToken, getJobById);

/**
 * @route PUT /api/jobs/update/:id
 * @description Update job details
 * @access Private (Job Poster/Admin only)
 * @header Authorization: Bearer <token>
 * @param {string} id - Job ID to update
 * @param {Object} updates - Fields to update
 */
router.route("/update/:id").put(authenticateToken, updateJob);

export default router;