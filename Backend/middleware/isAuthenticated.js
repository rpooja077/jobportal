import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log('🔐 Token received:', token ? 'Yes' : 'No');
    
    if (!token) {
      console.log('❌ No token provided');
      return res
        .status(401)
        .json({ message: "No token provided", success: false });
    }
    
    const jwtSecret = process.env.JWT_SECRET || "your_jwt_secret_key_here";
    const decoded = jwt.verify(token, jwtSecret);
    console.log('🔓 Token decoded:', decoded);
    
    if (!decoded) {
      console.log('❌ Invalid token');
      return res.status(401).json({ message: "Invalid token", success: false });
    }
    
    req.id = decoded.userId;
    req.user = {
      userId: decoded.userId,
      role: decoded.role || 'Student' // Default to Student if role not in token
    };
    
    console.log('✅ Authentication successful for user:', decoded.userId, 'role:', decoded.role);
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    return res.status(401).json({ message: "Invalid token", success: false });
  }
};

export default authenticateToken;


// // jsonwebtoken library import kar rahe hai (JWT generate/verify karne ke liye use hoti hai)
// import jwt from "jsonwebtoken";

// // Middleware function jo har request ke token ko verify karega
// const authenticateToken = (req, res, next) => {
//   try {
//     // client ke cookies se token nikal rahe hai
//     // (maan kar chal rahe hai ki token cookies me "token" naam se store hai)
//     const token = req.cookies.token;

//     // agar token hi nahi mila to unauthorized (401) return kar denge
//     if (!token) {
//       return res
//         .status(401)
//         .json({ message: "No token provided", success: false });
//     }

//     // jwt.verify() token ko decode aur verify karta hai
//     // process.env.JWT_SECRET secret key ke saath match hota hai jo tumne .env file me rakhi hogi
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // agar token verify nahi hua to unauthorized response bhej denge
//     if (!decoded) {
//       return res
//         .status(401)
//         .json({ message: "Invalid token", success: false });
//     }

//     // agar token valid hai to decoded object se userId nikal kar req.id me store kar dete hai
//     // taaki baaki routes me directly use kar sake
//     req.id = decoded.userId;

//     // middleware complete ho gaya, ab next() se request ko next handler ya controller tak bhej denge
//     next();
//   } catch (error) {
//     // agar koi error aata hai (jaise expired token, galat token, etc.)
//     // to unauthorized response bhej denge
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };

// // is middleware ko export kar rahe hai taaki routes me use kar sake
// export default authenticateToken;
// 👉 Simple flow:

// Client → Server request bhejta hai (cookies me token ke saath).

// Middleware check karta hai: token hai ya nahi.

// Agar token hai → verify karega using jwt.verify().

// Agar valid hai → req.id me userId store karega.

// Agar invalid/expired hai → 401 Unauthorized response de dega.

