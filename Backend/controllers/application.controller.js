/**
 * Application Controller
 * 
 * This controller handles all job application-related operations including:
 * - Job application submission
 * - Retrieving application status
 * - Managing application workflow (view, update status)
 * - Applicant tracking for recruiters
 */

import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

/**
 * Apply for a job
 * POST /api/applications/apply/:id
 * 
 * @param {Object} req - Express request object with job ID in params and user info in request
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with application status
 */
export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const userRole = req.user?.role; // Get user role from request
    const jobId = req.params.id;
    
    console.log('🔍 Job application attempt:', { userId, userRole, jobId });
    
    if (!jobId) {
      return res
        .status(400)
        .json({ message: "Invalid job id", success: false });
    }
    
    // Check if user is a Student (only students can apply for jobs)
    if (userRole !== 'Student') {
      console.log('❌ Recruiter/Admin trying to apply for job:', userRole);
      return res.status(403).json({
        message: "Only students can apply for jobs. Recruiters cannot apply for jobs.",
        success: false,
      });
    }
    
    // check if the user already has applied for this job
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });
    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
        success: false,
      });
    }
    
    //check if the job exists or not
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found", success: false });
    }
    
    // Check if user is trying to apply for their own job
    if (job.created_by.toString() === userId) {
      console.log('❌ User trying to apply for their own job');
      return res.status(403).json({
        message: "You cannot apply for your own job posting",
        success: false,
      });
    }
    
    console.log('✅ All validations passed, creating application...');
    
    // create a new application
    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
    });
    job.applications.push(newApplication._id);
    await job.save();

    console.log('🎉 Application created successfully:', newApplication._id);
    
    return res
      .status(201)
      .json({ message: "Application submitted", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;
    const application = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        options: { sort: { createdAt: -1 } },
        populate: { path: "company", options: { sort: { createdAt: -1 } } },
      });
    if (!application) {
      return res
        .status(404)
        .json({ message: "No applications found", success: false });
    }

    return res.status(200).json({ application, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;
    
    // Validate job ID format
    if (!jobId || !jobId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        message: "Invalid job ID format", 
        success: false 
      });
    }

    const job = await Job.findById(jobId).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: { 
        path: "applicant", 
        options: { sort: { createdAt: -1 } },
        select: "fullname email phoneNumber profile createdAt"
      },
    });
    
    if (!job) {
      return res.status(404).json({ message: "Job not found", success: false });
    }

    // Safely process applications with error handling
    let applicationsWithResumeInfo = [];
    try {
      applicationsWithResumeInfo = job.applications.map(app => {
        if (!app.applicant) {
          console.warn('Application without applicant:', app._id);
          return null;
        }
        
        const hasResume = app.applicant?.profile?.resume && 
                         app.applicant.profile.resume.trim() !== "";
        
        return {
          ...app.toObject(),
          applicant: {
            ...app.applicant.toObject(),
            hasResume,
            resumeUrl: app.applicant?.profile?.resume || null,
            resumeFileName: app.applicant?.profile?.resumeOriginalname || null
          }
        };
      }).filter(app => app !== null); // Remove null applications
    } catch (mapError) {
      console.error('Error processing applications:', mapError);
      // Continue with empty applications array if mapping fails
      applicationsWithResumeInfo = [];
    }

    // Create safe response object
    const safeJob = {
      ...job.toObject(),
      applications: applicationsWithResumeInfo
    };

    return res.status(200).json({ 
      job: safeJob,
      success: true 
    });
  } catch (error) {
    console.error('Error in getApplicants:', error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;
    if (!status) {
      return res.status(400).json({
        message: "status is required",
        success: false,
      });
    }

    // find the application by applicantion id
    const application = await Application.findOne({ _id: applicationId });
    if (!application) {
      return res.status(404).json({
        message: "Application not found.",
        success: false,
      });
    }

    // update the status
    application.status = status.toLowerCase();
    await application.save();

    return res
      .status(200)
      .json({ message: "Application status updated", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

/**
 * Get detailed information about an applicant
 * GET /api/applications/applicant/:applicationId
 * 
 * @param {Object} req - Express request object with application ID in params
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with applicant details
 */
export const getApplicantDetails = async (req, res) => {
  try {
    const applicationId = req.params.id;
    
    const application = await Application.findById(applicationId)
      .populate({
        path: "applicant",
        select: "fullname email phoneNumber profile",
      })
      .populate({
        path: "job",
        select: "title company",
        populate: { path: "company", select: "name" }
      });

    if (!application) {
      return res.status(404).json({ 
        message: "Application not found", 
        success: false 
      });
    }

    return res.status(200).json({ 
      application, 
      success: true 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};


// import { Application } from "../models/application.model.js";
// import { Job } from "../models/job.model.js";

// // ================= APPLY FOR A JOB =================
// export const applyJob = async (req, res) => {
//   try {
//     const userId = req.id;             // token se nikala hua userId
//     const jobId = req.params.id;       // URL params se job id

//     // jobId check
//     if (!jobId) {
//       return res
//         .status(400)
//         .json({ message: "Invalid job id", success: false });
//     }

//     // check agar user ne pehle hi apply kiya hai
//     const existingApplication = await Application.findOne({
//       job: jobId,
//       applicant: userId,
//     });
//     if (existingApplication) {
//       return res.status(400).json({
//         message: "You have already applied for this job",
//         success: false,
//       });
//     }

//     // check agar job exist karti hai ya nahi
//     const job = await Job.findById(jobId);
//     if (!job) {
//       return res.status(404).json({ message: "Job not found", success: false });
//     }

//     // new application create karo
//     const newApplication = await Application.create({
//       job: jobId,
//       applicant: userId,
//     });

//     // job ke applications array me push kar do
//     job.applications.push(newApplication._id);
//     await job.save();  // job update karna zaroori hai

//     return res
//       .status(201)
//       .json({ message: "Application submitted", success: true });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error", success: false });
//   }
// };

// // ================= GET APPLIED JOBS =================
// export const getAppliedJobs = async (req, res) => {
//   try {
//     const userId = req.id;   // token se nikala hua userId

//     // user ke sare applications find karo aur job + company ke sath populate karo
//     const application = await Application.find({ applicant: userId })
//       .sort({ createdAt: -1 })
//       .populate({
//         path: "job",
//         options: { sort: { createdAt: -1 } },
//         populate: { path: "company", options: { sort: { createdAt: -1 } } },
//       });

//     // yahan dikkat: find hamesha array return karega, null nahi
//     if (application.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No applications found", success: false });
//     }

//     return res.status(200).json({ application, success: true });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error", success: false });
//   }
// };

// // ================= GET APPLICANTS OF A JOB =================
// export const getApplicants = async (req, res) => {
//   try {
//     const jobId = req.params.id;   // jis job ke applicants chahiye uski id

//     // job ke applications populate karo aur applicant ke details bhi laao
//     const job = await Job.findById(jobId).populate({
//       path: "applications",
//       options: { sort: { createdAt: -1 } },
//       populate: { path: "applicant", options: { sort: { createdAt: -1 } } }, // yahan par select use karke sensitive fields hide kar sakte ho
//     });

//     if (!job) {
//       return res.status(404).json({ message: "Job not found", success: false });
//     }

//     return res.status(200).json({ job, success: true });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error", success: false });
//   }
// };

// // ================= UPDATE APPLICATION STATUS =================
// export const updateStatus = async (req, res) => {
//   try {
//     const { status } = req.body;        // frontend se aaya status (pending, accepted, rejected)
//     const applicationId = req.params.id;

//     // status validation
//     if (!status) {
//       return res.status(400).json({
//         message: "status is required",
//         success: false,
//       });
//     }

//     // valid statuses check karo
//     const validStatuses = ["pending", "accepted", "rejected"];
//     if (!validStatuses.includes(status.toLowerCase())) {
//       return res.status(400).json({
//         message: "Invalid status value",
//         success: false,
//       });
//     }

//     // application find karo
//     const application = await Application.findOne({ _id: applicationId });
//     if (!application) {
//       return res.status(404).json({
//         message: "Application not found.",
//         success: false,
//       });
//     }

//     // status update karo
//     application.status = status.toLowerCase();
//     await application.save();

//     return res
//       .status(200)
//       .json({ message: "Application status updated", success: true });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error", success: false });
//   }
// };
