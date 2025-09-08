/**
 * Company Model
 * 
 * Defines the schema for company information in the database.
 * Stores details about companies that post jobs on the platform.
 * 
 * Fields:
 * - name: Company name (required, unique)
 * - description: Detailed company description
 * - website: Company website URL
 * - location: Company's physical location
 * - logo: URL to company's logo image
 * - userId: Reference to the User who created the company (required)
 * - timestamps: Automatically adds createdAt and updatedAt fields
 */

import mongoose from "mongoose";

// Define the company schema with all fields and validations
const companySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String, 
    },
    website:{
        type:String 
    },
    location:{
        type:String 
    },
    logo:{
        type:String // URL to company logo
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
},{timestamps:true})
// Create and export the Company model
export const Company = mongoose.model("Company", companySchema);

// // Company ke liye schema define kar rahe hain
// const companySchema = new mongoose.Schema(
//   {
//     // Company ka naam (string, required aur unique hoga)
//     // Example: "Infosys", "TCS"
//     name: {
//       type: String,
//       required: true,
//       unique: true,
//     },

//     // Company ka description (short info, optional field)
//     // Example: "IT services and consulting company"
//     description: {
//       type: String,
//     },

//     // Company ki website ka URL (optional field)
//     // Example: "https://infosys.com"
//     website: {
//       type: String,
//     },

//     // Company ki location (optional field)
//     // Example: "Indore", "Bangalore"
//     location: {
//       type: String,
//     },

//     // Company ka logo ka URL (string)
//     // Example: "https://logo.com/infosys.png"
//     logo: {
//       type: String, // URL to company logo
//     },

//     // Company ka owner ya recruiter ka reference (User model se linked hoga)
//     // Yeh batata hai ki kis User ne company create/post ki hai
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User", // "User" model ko refer karega
//       required: true,
//     },
//   },
//   {
//     // timestamps: true => MongoDB automatically createdAt aur updatedAt fields add karega
//     timestamps: true,
//   }
// );

// // schema ke basis par "Company" naam ka model banaya ja raha hai
// // isse hum "companies" collection me CRUD operations karenge
// export const Company = mongoose.model("Company", companySchema);
