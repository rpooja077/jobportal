import mongoose from "mongoose";
const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export const Application = mongoose.model("Application", applicationSchema);

// // mongoose ko import kar rahe hain (MongoDB ke saath kaam karne ke liye)
// import mongoose from "mongoose";

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

