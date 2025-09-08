/**
 * Application Routes
 * 
 * This file defines all API endpoints related to job applications.
 * All routes are protected and require a valid JWT token.
 * 
 * Base URL: /api/applications
 */

import express from "express";
import authenticateToken from "../middleware/isAuthenticated.js";
import { 
  applyJob, 
  getApplicants, 
  getAppliedJobs, 
  updateStatus, 
  getApplicantDetails 
} from "../controllers/application.controller.js";

// Create an Express router
const router = express.Router();

/**
 * @route GET /api/applications/apply/:id
 * @description Apply for a job
 * @access Private (Job Seeker)
 * @header Authorization: Bearer <token>
 * @param {string} id - Job ID to apply for
 */
router.route("/apply/:id").get(authenticateToken, applyJob);

/**
 * @route GET /api/applications/get
 * @description Get all jobs applied by the current user
 * @access Private (Job Seeker)
 * @header Authorization: Bearer <token>
 */
router.route("/get").get(authenticateToken, getAppliedJobs);

/**
 * @route GET /api/applications/:id/applicants
 * @description Get all applicants for a specific job
 * @access Private (Job Poster/Admin)
 * @header Authorization: Bearer <token>
 * @param {string} id - Job ID to get applicants for
 */
router.route("/:id/applicants").get(authenticateToken, getApplicants);

/**
 * @route POST /api/applications/status/:id/update
 * @description Update application status
 * @access Private (Job Poster/Admin)
 * @header Authorization: Bearer <token>
 * @param {string} id - Application ID to update
 * @param {string} status - New status (e.g., 'pending', 'shortlisted', 'rejected')
 */
router.route("/status/:id/update").post(authenticateToken, updateStatus);

/**
 * @route GET /api/applications/applicant/:id
 * @description Get detailed information about a specific applicant
 * @access Private (Job Poster/Admin)
 * @header Authorization: Bearer <token>
 * @param {string} id - Application ID to get details for
 */
router.route("/applicant/:id").get(authenticateToken, getApplicantDetails);

export default router;