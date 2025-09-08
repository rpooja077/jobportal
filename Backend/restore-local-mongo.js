import fs from 'fs';
import path from 'path';

// Original working local MongoDB configuration
const envContent = `# MongoDB Connection - Local working configuration
MONGODB_URI=mongodb://127.0.0.1:27017/job_portal

# JWT Secret - Original working key
JWT_SECRET=my_super_secret_jwt_key_for_job_portal_2024

# Server Configuration
PORT=4000
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Cloudinary Configuration - Original working keys
CLOUDINARY_CLOUD_NAME=dvkpbw864
CLOUDINARY_API_KEY=877442722422788
CLOUDINARY_API_SECRET=0yYMe02bPZw_RTIPlPY9TOSXIQk

# Email Configuration - Original working settings
EMAIL_USER=rajolepooja077@gmail.com
EMAIL_PASSWORD=bgaoxgldygsrjncf
`;

const envPath = path.join(process.cwd(), '.env');

try {
  // Delete current .env file first
  if (fs.existsSync(envPath)) {
    fs.unlinkSync(envPath);
    console.log('🗑️ Current .env file deleted');
  }
  
  // Create new .env file with local MongoDB
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Local MongoDB configuration restored!');
  console.log('');
  console.log('🎉 Ab aapka original working configuration wapas aa gaya hai:');
  console.log('✅ MongoDB: Local connection (127.0.0.1:27017)');
  console.log('✅ JWT Secret: Original working key');
  console.log('✅ Cloudinary: All keys configured');
  console.log('✅ Email: Gmail configured');
  console.log('');
  console.log('🚀 Ab server start kar sakte hain: npm start');
  console.log('💡 Local MongoDB chalana hoga: mongod');
} catch (error) {
  console.error('❌ Error restoring local configuration:', error.message);
}







