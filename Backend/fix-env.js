import fs from 'fs';
import path from 'path';

const envContent = `# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://pooja077:YOUR_ACTUAL_PASSWORD@cluster0.arehes8.mongodb.net/job_portal?retryWrites=true&w=majority&appName=Cluster0

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production

# Server Configuration
PORT=4000
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Email Configuration (for OTP)
EMAIL_USER=rajolepooja077@gmail.com
EMAIL_PASSWORD=your-app-password

# Cloudinary Configuration (optional)
# CLOUDINARY_CLOUD_NAME=your_cloud_name
# CLOUDINARY_API_KEY=your_api_key
# CLOUDINARY_API_SECRET=your_api_secret
`;

const envPath = path.join(process.cwd(), '.env');

try {
  // Delete the corrupted .env file first
  if (fs.existsSync(envPath)) {
    fs.unlinkSync(envPath);
    console.log('🗑️ Corrupted .env file deleted');
  }
  
  // Create new .env file
  fs.writeFileSync(envPath, envContent);
  console.log('✅ New .env file created successfully!');
  console.log('');
  console.log('📝 IMPORTANT: Now edit the .env file and replace YOUR_ACTUAL_PASSWORD with your real MongoDB Atlas password');
  console.log('🔑 Example: mongodb+srv://pooja077:abc123@cluster0.arehes8.mongodb.net/job_portal?retryWrites=true&w=majority&appName=Cluster0');
  console.log('');
  console.log('💡 Use the same password that was working before!');
} catch (error) {
  console.error('❌ Error fixing .env file:', error.message);
}
