/**
 * Job Model
 * 
 * Defines the schema for job postings in the database.
 * Includes fields for job details, requirements, and application tracking.
 * 
 * Fields:
 * - title: Job title
 * - description: Detailed job description
 * - requirements: Array of job requirements
 * - salary: Salary range or amount
 * - experienceLevel: Years of experience required
 * - location: Job location (remote/onsite/hybrid + city)
 * - jobType: Type of employment (Full-time/Part-time/Contract/Internship)
 * - company: Reference to the Company model
 * - created_by: Reference to the User who created the job
 * - status: Job status (Active/Inactive/Closed)
 * - applications: Array of user applications
 * - skills: Array of required skills
 * - deadline: Application deadline
 * - createdAt: Timestamp of job creation
 * - updatedAt: Timestamp of last update
 */

import mongoose from "mongoose";

// Define the job schema with all fields and references
const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    requirements: [
      {
        type: String,
      },
    ],
    salary: {
      type: String,
      required: true,
    },
    experienceLevel: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    jobType: {
      type: String,
      required: true,
    },
    position: {
      type: Number,
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
      },
    ],
  },
  { timestamps: true }
);
export const Job = mongoose.model("Job", jobSchema);

// // mongoose ko import kar rahe hai (MongoDB ke saath kaam karne ke liye)
// import mongoose from "mongoose";

// // Job ke liye schema define kar rahe hai
// const jobSchema = new mongoose.Schema(
//   {
//     // Job ka title (ex: Software Engineer) - required field
//     title: {
//       type: String,
//       required: true,
//     },

//     // Job ka description (job me kya work hoga) - required field
//     description: {
//       type: String,
//       required: true,
//     },

//     // Job ke requirements (skills, tools, etc.) - string array ke form me
//     requirements: [
//       {
//         type: String,
//       },
//     ],

//     // Salary detail (string rakhi hai - e.g., "5-8 LPA") - required field
//     salary: {
//       type: String,
//       required: true,
//     },

//     // Job ke liye required experience (number me, e.g., 2 years) - required field
//     experienceLevel: {
//       type: Number,
//       required: true,
//     },

//     // Job ki location (string, e.g., "Indore") - required field
//     location: {
//       type: String,
//       required: true,
//     },

//     // Job type (full-time, part-time, remote, etc.) - required field
//     jobType: {
//       type: String,
//       required: true,
//     },

//     // Open positions (kitni vacancies hain) - required field
//     position: {
//       type: Number,
//       required: true,
//     },

//     // Company reference (kis company me job hai)
//     // Company model ka ObjectId yahan store hoga
//     company: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Company",
//       required: true,
//     },

//     // Kis user (Recruiter) ne job post ki hai (User model ka reference)
//     created_by: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     // Job ke liye jo applications ayi hain unka array
//     // har ek application Application model ka ObjectId hoga
//     applications: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Application",
//       },
//     ],
//   },
//   {
//     // timestamps: true => automatically createdAt aur updatedAt fields generate ho jayengi
//     timestamps: true,
//   }
// );

// // schema ke basis par Job model banaya ja raha hai
// // isse hum "jobs" collection me CRUD operations kar sakte hai
// export const Job = mongoose.model("Job", jobSchema);
