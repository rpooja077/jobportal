// Main server file with email OTP verification
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./utils/db.js";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import fs from "fs";

// Routes
import userRoutes from "./routes/user.route.js";                                        
import jobRoutes from "./routes/job.route.js";
import companyRoutes from "./routes/company.route.js";
import applicationRoutes from "./routes/application.route.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// CORS configuration
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174", 
    "http://localhost:3000",
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Created uploads directory');
}

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));
app.use('/profile-photos', express.static('uploads'));

// Profile photo serving route
app.get('/profile-photo/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(process.cwd(), 'uploads', filename);
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    console.log(`❌ Profile photo not found: ${filename}`);
    res.status(404).json({ message: "Profile photo not found" });
  }
});

// Resume serving routes
app.get('/resume/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(process.cwd(), 'uploads', filename);
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ message: "Resume not found" });
  }
});

app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(process.cwd(), 'uploads', filename);
  
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).json({ message: "File not found" });
  }
});

// Cloudinary configuration
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log("✅ Cloudinary configured successfully");
} else {
  console.log("⚠️ Cloudinary not configured - using local file storage");
}

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    message: "Job Portal Backend is running!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

// Test endpoint
app.get("/test", (req, res) => {
  res.status(200).json({
    message: "Test route working!",
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/job", jobRoutes);
app.use("/api/v1/company", companyRoutes);
app.use("/api/v1/application", applicationRoutes);

// Backward compatibility routes
app.use("/api/user", userRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/application", applicationRoutes);

// Connect to database
connectDB();

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📧 Email OTP verification enabled`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});
