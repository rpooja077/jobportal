import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Use original working configuration - allow both local and Atlas
    const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/job_portal";
    
    // MongoDB connection options
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(mongoURI, options);
    
    console.log("✅ MongoDB Connected Successfully!");
    
    // Extract database name from URI for better logging
    const dbName = mongoose.connection.name || "job_portal";
    console.log(`📊 Database: ${dbName}`);
    console.log(`🔗 Connection: ${mongoURI.includes('mongodb+srv') ? 'MongoDB Atlas' : 'Local MongoDB'}`);
    
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log("💡 Make sure MongoDB is running on your system");
      console.log("   You can start MongoDB with: mongod");
    } else if (error.message.includes('Authentication failed')) {
      console.log("💡 Check your MongoDB username and password in .env file");
      console.log("   Make sure to use your original working password");
    } else if (error.message.includes('ENOTFOUND')) {
      console.log("💡 Check your MongoDB Atlas cluster URL");
      console.log("   Make sure the cluster is accessible and the URL is correct");
    }
    
    process.exit(1);
  }
};

export default connectDB;


// import mongoose from "mongoose";
// // 'mongoose' import kiya jo MongoDB ke saath connect hone aur schema/model banane ke kaam aata hai

// const connectDB = async () => {
//   try {
//     // MongoDB ke saath connection establish karne ki koshish
    
//     await mongoose.connect("mongodb://127.0.0.1:27017/job_portal");
//     // 'mongoose.connect()' se database ke saath connection banaya
//     // mongodb://127.0.0.1:27017 => ye local system pr chal rahi MongoDB ki default URI hai
//     // job_portal => ye tumhare database ka naam hai (agar nahi hoga to MongoDB automatically bana dega)

//     console.log(" MongoDB Local Connected...");
//     // Agar connection successful hua to console me ye message aayega
//   } catch (error) {
//     // Agar connection fail ho gaya to error catch hoga
    
//     console.error(" MongoDB Connection Error:", error.message);
//     // error message print karega console me
    
//     process.exit(1);
//     // process.exit(1) => iska matlab program ko immediately band kar do
//     // (1 ka matlab hai program abnormal exit ke saath terminate hua)
//   }
// };

// export default connectDB;
// // connectDB function ko export kar diya taaki app.js ya index.js me use kar sako

