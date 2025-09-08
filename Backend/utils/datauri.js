import DataUriParser from "datauri/parser.js"

import path from "path";

const getDataUri = (file) => {
    const parser = new DataUriParser();
    const extName = path.extname(file.originalname).toString();
    return parser.format(extName, file.buffer);
}

export default getDataUri;




// import DataUriParser from "datauri/parser.js"
// // 'datauri/parser' se DataUriParser import kiya
// // iska kaam hota hai file ko Data URI (base64 string) me convert karna

// import path from "path";
// // path module import kiya, isse hum file ka extension (ex: .jpg, .png) nikalenge

// const getDataUri = (file) => {
//     const parser = new DataUriParser(); 
//     // DataUriParser ka ek naya instance banaya
    
//     const extName = path.extname(file.originalname).toString();
//     // file.originalname (jo multer se milti hai) ka extension nikala (.png, .jpg, .pdf)
//     // aur usko string me convert kiya
    
//     return parser.format(extName, file.buffer);
//     // parser.format(extension, file.buffer) => ek object return karta hai
//     // jisme .content property hoti hai jo base64 Data URI hoti hai
//     // ye datauri Cloudinary me upload karne ke liye use hoti hai
// }

// export default getDataUri;
// // function ko export kar diya taaki controllers me use kar sako
// ⚡ Example use (maan lo profile photo upload karni hai Cloudinary pe):

// js
// Copy code
// import cloudinary from "../utils/cloudinary.js";
// import getDataUri from "../utils/datauri.js";

// export const updateProfile = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "File required" });
//     }

//     // File ko Data URI me convert karo
//     const fileUri = getDataUri(req.file);

//     // Cloudinary pe upload karo
//     const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
//       resource_type: "auto",
//     });

//     return res.status(200).json({
//       message: "Profile updated",
//       url: cloudResponse.secure_url,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
// 👉 Matlab getDataUri() ek helper function hai jo Multer se aayi file ko Cloudinary ke liye ready karta hai.
// Kya tumhe chahiye mai tumhare user.controller.js ke register aur updateProfile me getDataUri ka exact use bhi likh du?











