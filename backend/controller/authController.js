// const User = require('../models/User');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const sendOTP = require('../utils/sendOTP');
// const dotenv = require("dotenv").config();

// exports.signUp=async(req,res)=>{
//     try{
//         const {email,password}=req.body;
//         if(email.length===0 || password.length===0) return res.status(400).json({ msg: "email or password was required" });
//         const existuser=await User.findOne({email});
//         if(existuser) return res.statues(400).json({message:"user already exists"});
//         const hashpwd= await bcrypt.hash(password,12);
//         const user =await User.create({
//             email,
//             password:hashpwd,
//         });
//         const token=jwt.sign({id:user._id},process.env.JWT_SECRET);
//         res.status(201).json({token,user});
//     }catch(err){
//         res.status(500).json({ message: "Signup failed", error: err.message });
//     }
// }

// exports.login=async(req,res)=>{
//     try{
//         const {email,password}=req.body;
//         const user=await User.findOne({email});
//         if(!user || !user.password) return res.status(400).json({ msg: "Invalid credentials" });
//         const isMatch = await bcrypt.compare(password,user.password);
//         if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });
//         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
//         res.json({token,user});
//     }catch(err){
//         res.status(500).json({ message: "login failed", error: err.message });
//     }
// }

// exports.sendOTP = async (req, res) => {
//   try {
//     const { email } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ msg: "User not found" });
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     const otpExpiresAt = new Date(Date.now() + 10 * 60000); // 10 min
//     user.otp = otp;
//     user.otpExpiresAt = otpExpiresAt;
//     await user.save();
//     await sendOTP(email, otp);
//     res.json({ msg: "OTP sent to email" });
//   } catch (err) {
//     console.error("Error sending OTP:", err);
//     res.status(500).json({ message: "Failed to generate OTP", error: err.message });
//   }
// };


// // exports.verifyOTP = async (req, res) => {
// //     try{
// //       const {email,otp,newPassword } = req.body;
// //       const user = await User.findOne({ email });
// //       console.log("User OTP:", user.otp);
// //         console.log("Provided OTP:", otp);
// //         console.log("OTP Expiry:", user.otpExpiresAt);
// //       if (!user || user.otp !== otp || new Date() > user.otpExpiresAt){
// //         if(new Date()>user.otpExpiresAt){
// //             user.otp=null;
// //             user.otpExpiresAt=null;
// //             await user.save();
// //         }
// //         return res.status(400).json({ msg: "Invalid or expired OTP" });
// //       }
// //       user.password = await bcrypt.hash(newPassword, 12);
// //       user.otp=null;
// //       user.otpExpiresAt=null;
// //       await user.save();
// //       res.json({msg:"Password updated successfully"});
// //     }catch(err){
// //       res.status(500).json({msg:"Failed to verify OTP",error: err.message });
// //     }
// // };

// exports.verifyOTP = async (req, res) => {
//     try {
//       const { email,otp,password } = req.body;
//       console.log("Request:", { email, otp, password });
  
//       const user = await User.findOne({ email });
//       if (!user) {
//         console.log("User not found");
//         return res.status(400).json({ msg: "Invalid or expired OTP" });
//       }
  
//       console.log("Stored OTP:", user.otp);
//       console.log("Provided OTP:", otp);
//       console.log("Current Time:", new Date());
//       console.log("OTP Expiry Time:", user.otpExpiresAt);
  
//       if (user.otp !== otp || new Date() > user.otpExpiresAt) {
//         console.log("OTP invalid or expired");
//         if (new Date() > user.otpExpiresAt) {
//           user.otp = null;
//           user.otpExpiresAt = null;
//           await user.save();
//         }
//         return res.status(400).json({ msg: "Invalid or expired OTP" });
//       }
  
//       if (!password || user.password===password) {
//         console.log("Missing new password");
//         return res.status(400).json({ msg: "password not entered or entered the same password" });
//       }
  
//       user.password = await bcrypt.hash(password, 12);
//       user.otp = null;
//       user.otpExpiresAt = null;
//       await user.save();
  
//       res.json({ msg: "Password updated successfully" });
//     } catch (err) {
//       console.error("Error verifying OTP:", err);
//       res.status(500).json({ msg: "Failed to verify OTP", error: err.message });
//     }
//   };

// exports.googleSignIn = async (req, res) => {
//     res.status(501).json({ msg: "Google Sign-in not implemented yet" });
// };




// exports.login = async (req, res) => {
//   try {

//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ msg: "Email and password required" });
//     }

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(400).json({ msg: "Invalid credentials" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(400).json({ msg: "Invalid credentials" });
//     }

//     const token = jwt.sign(
//       { id: user._id },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     res.json({
//       token,
//       user: {
//         id: user._id,
//         email: user.email
//       }
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Login failed", error: err.message });
//   }
// };





// const User = require("../models/User");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const sendOTPEmail = require("../utils/sendOTP");

// /* ======================
//    SIGNUP
// ====================== */

// exports.signUp = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ msg: "Email and password required" });
//     }

//     const existUser = await User.findOne({ email });

//     if (existUser) {
//       return res.status(400).json({ msg: "User already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 12);

//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword
//     });

//     const token = jwt.sign(
//       { id: user._id },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     res.status(201).json({
//       token,
//       user
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Signup failed", error: err.message });
//   }
// };


// /* ======================
//    LOGIN
// ====================== */

// exports.login = async (req, res) => {
//   try {

//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ msg: "Email and password required" });
//     }

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(400).json({ msg: "Invalid credentials" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(400).json({ msg: "Invalid credentials" });
//     }

//     const token = jwt.sign(
//       { id: user._id },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     res.json({
//       token,
//       user
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Login failed", error: err.message });
//   }
// };


// /* ======================
//    SEND OTP
// ====================== */

// exports.sendOTP = async (req, res) => {
//   try {

//     const { email } = req.body;

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ msg: "User not found" });
//     }

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     user.otp = otp;
//     user.otpExpiresAt = new Date(Date.now() + 10 * 60000);

//     await user.save();

//     await sendOTPEmail(email, otp);

//     res.json({ msg: "OTP sent successfully" });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "OTP sending failed" });
//   }
// };


// /* ======================
//    VERIFY OTP
// ====================== */

// exports.verifyOTP = async (req, res) => {
//   try {

//     const { email, otp, password } = req.body;

//     const user = await User.findOne({ email });

//     if (!user || user.otp !== otp || new Date() > user.otpExpiresAt) {
//       return res.status(400).json({ msg: "Invalid or expired OTP" });
//     }

//     user.password = await bcrypt.hash(password, 12);
//     user.otp = null;
//     user.otpExpiresAt = null;

//     await user.save();

//     res.json({ msg: "Password updated successfully" });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "OTP verification failed" });
//   }
// };


// /* ======================
//    GOOGLE LOGIN (placeholder)
// ====================== */

// exports.googleSignIn = async (req, res) => {
//   res.status(501).json({ msg: "Google login not implemented yet" });
// };




// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// const signUp = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     if (!name || !email || !password) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const existingUser = await User.findOne({ email: email.toLowerCase() });

//     if (existingUser) {
//       return res.status(400).json({ message: "Email already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     await User.create({
//       name,
//       email: email.toLowerCase(),
//       password: hashedPassword
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Signup successful"
//     });
//   } catch (err) {
//     console.error("Signup error:", err);
//     return res.status(500).json({ message: "Signup failed" });
//   }
// };

// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email: email.toLowerCase() });

//     if (!user) {
//       return res.status(400).json({ message: "Invalid email or password" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid email or password" });
//     }

//     const token = jwt.sign(
//       { id: user._id },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     return res.json({
//       success: true,
//       token
//     });
//   } catch (err) {
//     console.error("Login error:", err);
//     return res.status(500).json({ message: "Login failed" });
//   }
// };

// // placeholders if you already use these
// const sendOTP = async (req, res) => {
//   return res.status(501).json({ message: "sendOTP not implemented" });
// };

// const verifyOTP = async (req, res) => {
//   return res.status(501).json({ message: "verifyOTP not implemented" });
// };

// const googleSignIn = async (req, res) => {
//   return res.status(501).json({ message: "googleSignIn not implemented" });
// };

// module.exports = {
//   signUp,
//   login,
//   sendOTP,
//   verifyOTP,
//   googleSignIn
// };





import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmailOTP from "../utils/sendOTP.js";
import dotenv from "dotenv";

dotenv.config();

// SIGNUP
export const signUp = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const existuser = await User.findOne({ email });

    if (existuser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashpwd = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: name || "",
      email,
      password: hashpwd,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.status(201).json({ success: true, token, user });
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !user.password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ success: true, token, user });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

// SEND OTP
export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60000);

    user.otp = otp;
    user.otpExpiry = otpExpiry;

    await user.save();
    await sendEmailOTP(email, otp);

    res.json({ success: true, message: "OTP sent to email" });
  } catch (err) {
    console.error("Error sending OTP:", err);

    res.status(500).json({
      message: "Failed to generate OTP",
      error: err.message
    });
  }
};

// VERIFY OTP
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    if (user.otp !== otp || new Date() > user.otpExpiry) {
      if (new Date() > user.otpExpiry) {
        user.otp = null;
        user.otpExpiry = null;
        await user.save();
      }

      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    user.password = await bcrypt.hash(password, 12);
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.error("Error verifying OTP:", err);

    res.status(500).json({
      message: "Failed to verify OTP",
      error: err.message
    });
  }
};

// GOOGLE LOGIN
export const googleSignIn = async (req, res) => {
  res.status(501).json({ message: "Google Sign-in not implemented yet" });
};