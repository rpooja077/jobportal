import dotenv from "dotenv";
import connectDB from "./utils/db.js";

// Load environment variables
dotenv.config();

console.log("🔍 Testing MongoDB Atlas Connection...");
console.log("📋 Environment Variables:");
console.log(`   MONGODB_URI: ${process.env.MONGODB_URI ? '✅ Set' : '❌ Not Set'}`);
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
console.log("");

if (!process.env.MONGODB_URI) {
  console.log("❌ MONGODB_URI is not set in your .env file");
  console.log("💡 Please create a .env file with your MongoDB Atlas connection string");
  console.log("   Example:");
  console.log("   MONGODB_URI=mongodb+srv://pooja077:YOUR_ACTUAL_PASSWORD@cluster0.arehes8.mongodb.net/job_portal?retryWrites=true&w=majority&appName=Cluster0");
  process.exit(1);
}

// Test the connection
try {
  await connectDB();
  console.log("🎉 MongoDB Atlas connection test successful!");
  console.log("✅ You can now run your main application");
  
  // Close the connection after testing
  process.exit(0);
} catch (error) {
  console.log("❌ MongoDB Atlas connection test failed!");
  console.log("💡 Please check your connection string and try again");
  process.exit(1);
}
