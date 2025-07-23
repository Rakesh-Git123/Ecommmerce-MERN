import User from "../models/user.model.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js"
import nodemailer from 'nodemailer';

export const signup=async(req,res)=>{

  const { name, email, password } = req.body;
  try {
    
    if (password.length < 6) {
      return res.status(400).json({ success:false,message: "Password must be at least 6 characters" });
    }
    const user = await User.findOne({ email });

    if (user) return res.status(400).json({ success:false,message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({success:true,message:"Signup up successfully"})
}
    catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ success:false,message: "Internal Server Error" });
      }
}

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      isAdmin:user.isAdmin   
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS,  
  },
});

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Generate OTP (6 digits)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpires = Date.now() + 15 * 60 * 1000; // 15 minutes expiry
    await user.save();

    // Send OTP email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is ${otp}. It will expire in 15 minutes.`,
    });

    res.status(200).json({ success: true, message: 'OTP sent to email' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const resetPasswordWithOtp = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (!user.otp || user.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    if (Date.now() > user.otpExpires) {
      return res.status(400).json({ success: false, message: 'OTP expired' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successful' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


export const checkAuth = (req, res) => {
  try {
    res.status(200).json({ success: true, user:req.user });
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ success:false,message: "Internal Server Error" });
  }
};

//Update User
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user=await User.findById(userId);
    let updatedImage = user.image; 

        if (req.file) {
            const uploadResponse = await cloudinary.uploader.upload(req.file.path);
            updatedImage = uploadResponse.secure_url;

        }
    await User.findByIdAndUpdate(
      userId,
      { 
        name:req.body.name || user.name,
        profilePic: updatedImage }, 
      { new: true }
    );

    res.status(200).json({message:"Upated successfully"});
  } catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//Admin Routes

//Get all users

export const getAllUsers=async(req,res)=>{
  try{
    const users=await User.find();
    res.json({success:true,users});
  }
  catch(err){
    console.log(err.message);
    res.status(500).json({success: false, message: "Internal Server Error"})
  }
}

//Delete user

export const deleteUser=async(req,res)=>{
  try{
    const user= await User.findByIdAndDelete(req.params.id);
    if(!user){
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, messsage:"User delete successfully" });
  }
  catch(err){
    console.log(err.message);
    res.status(500).json({success: false, message: "Internal Server Error"})
  }
}
