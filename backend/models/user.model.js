import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePic:{
    type:String,
    default:"https://png.pngtree.com/png-clipart/20200224/original/pngtree-avatar-icon-profile-icon-member-login-vector-isolated-png-image_5247852.jpg"
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  otp: String,
  otpExpires: Date
}, { timestamps: true });

export default mongoose.model('User', userSchema);
