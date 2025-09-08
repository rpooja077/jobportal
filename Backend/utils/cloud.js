import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import streamifier from "streamifier";

dotenv.config();

// Check if Cloudinary credentials are available
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

let cloudinaryConfigured = false;

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
  cloudinaryConfigured = true;
  console.log(" Cloudinary configured successfully");
} else {
  console.log("  Cloudinary credentials not found. Using local file storage.");
  console.log(" Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your .env file");
}

// Fallback file upload function
export const uploadFileFallback = async (file) => {
  try {
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.originalname}`;
    const filePath = path.join(uploadsDir, fileName);

    // Write file to local storage
    fs.writeFileSync(filePath, file.buffer);

    // Return local URL using the new resume route
    const localUrl = `http://localhost:4000/resume/${fileName}`;
    
    console.log("File saved locally:", localUrl);
    return {
      secure_url: localUrl,
      originalname: file.originalname
    };
  } catch (error) {
    console.error("Local file upload error:", error);
    throw error;
  }
};

// Main upload function that uses Cloudinary or fallback
export const uploadFile = async (fileDataUri, originalName = "resume.pdf") => {
  if (cloudinaryConfigured) {
    // Decide resource_type based on extension
    const ext = (originalName?.split('.').pop() || '').toLowerCase();
    const isRaw = ["pdf", "doc", "docx", "txt"].includes(ext);
    const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(ext);

    // Choose folder based on file type
    let folder = "resumes";
    if (isImage) {
      folder = "profile-photos";
    }

    const response = await cloudinary.uploader.upload(fileDataUri.content, {
      resource_type: isRaw ? "raw" : "image",
      folder: folder,
      type: "upload",
      access_mode: "public",
      use_filename: true,
      unique_filename: true,
      filename_override: originalName,
    });
    console.log("✅ Cloudinary upload response:", response);
    return response;
  } else {
    // Fallback expects a multer file; this path is only used when Cloudinary creds missing
    return await uploadFileFallback(fileDataUri);
  }
};




// export const uploadFile = (file) => {
//   return new Promise((resolve, reject) => {
//     const uploadStream = cloudinary.uploader.upload_stream(
//       {
//         folder: "resumes",
//         resource_type: "auto"
//       },
//       (error, result) => {
//         if (error) {
//           console.error("Cloudinary Upload Error:", error);
//           reject(error);
//         } else {
//           resolve(result);
//         }
//       }
//     );
//     streamifier.createReadStream(file.buffer).pipe(uploadStream);
//   });
// };

export default cloudinary;

