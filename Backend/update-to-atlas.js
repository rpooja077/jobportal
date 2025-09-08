import fs from 'fs';
import path from 'path';

// Read current .env file
const envPath = path.join(process.cwd(), '.env');
let currentContent = '';

try {
  currentContent = fs.readFileSync(envPath, 'utf8');
  console.log('📖 Current .env file loaded');
} catch (error) {
  console.error('❌ Error reading .env file:', error.message);
  process.exit(1);
}

// Update MongoDB URI to Atlas
const updatedContent = currentContent.replace(
  'MONGODB_URI=mongodb://127.0.0.1:27017/job_portal',
  'MONGODB_URI=mongodb+srv://pooja077:YOUR_ATLAS_PASSWORD@cluster0.arehes8.mongodb.net/job_portal?retryWrites=true&w=majority&appName=Cluster0'
);

// Write updated content
try {
  fs.writeFileSync(envPath, updatedContent);
  console.log('✅ MongoDB URI updated to Atlas!');
  console.log('');
  console.log('📝 AB YE KARO:');
  console.log('1. .env file open karo');
  console.log('2. YOUR_ATLAS_PASSWORD ko apne real MongoDB Atlas password se replace karo');
  console.log('3. File save karo');
  console.log('');
  console.log('🔑 Example:');
  console.log('mongodb+srv://pooja077:abc123@cluster0.arehes8.mongodb.net/job_portal?retryWrites=true&w=majority&appName=Cluster0');
  console.log('');
  console.log('💡 Pehle jo Atlas password working tha, wahi use karo!');
} catch (error) {
  console.error('❌ Error updating .env file:', error.message);
}







