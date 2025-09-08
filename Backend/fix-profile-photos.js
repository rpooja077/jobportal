import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./models/user.model.js";

dotenv.config();

const fixProfilePhotos = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find users with resume URLs in profilePhoto
    const usersWithResumeInPhoto = await User.find({
      'profile.profilePhoto': { 
        $regex: /\.(pdf|doc|docx|txt)|resumes\// 
      }
    });

    console.log(`Found ${usersWithResumeInPhoto.length} users with resume URLs in profilePhoto`);

    // Fix each user
    for (const user of usersWithResumeInPhoto) {
      console.log(`Fixing user: ${user.fullname} (${user._id})`);
      console.log(`Current profilePhoto: ${user.profile.profilePhoto}`);
      
      // Clear the profilePhoto
      user.profile.profilePhoto = "";
      await user.save();
      
      console.log(`✅ Fixed user: ${user.fullname}`);
    }

    console.log('✅ All profile photos fixed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing profile photos:', error);
    process.exit(1);
  }
};

fixProfilePhotos();





