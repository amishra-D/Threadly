const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
dotenv.config();
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (!existingUser.isVerified) {
        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
        const otpExpiry = Date.now() + 5 * 60 * 1000;

        existingUser.otp = otp;
        existingUser.otpExpiry = otpExpiry;
        
        await existingUser.save();

        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'OTP Verification',
          text: `Your OTP is: ${otp}`,
        });

        return res.status(200).json({ message: 'OTP resent. Please check your email.' });
      }

      return res.status(400).json({ message: 'User already verified. Please login.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
    const otpExpiry = Date.now() + 5 * 60 * 1000;

    const newUser = new User({
      username,
      email,
      passwordHash: hashedPassword,
      isVerified: false,
      otp,
      otpExpiry,
    });

    await newUser.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: email,
  subject: 'OTP Verification',
  html: `
    <html lang="en">
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #000000;
            color: #ffffff;
            padding: 20px;
            margin: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #1a1a1a;
            border-radius: 8px;
            padding: 30px;
            text-align: center;
          }
          .logo {
            width: 100px;
            margin-bottom: 20px;
          }
          .otp {
            background-color: #ddff00;
            color: #000000;
            font-size: 32px;
            font-weight: bold;
            padding: 15px;
            border-radius: 8px;
            display: inline-block;
            margin-top: 20px;
          }
          .footer {
            font-size: 14px;
            color: #cccccc;
            margin-top: 30px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <img src="cid:logo" alt="Logo" class="logo" />
          <h2>OTP Verification</h2>
          <h3>Threadly</h3>
          <p style="font-size: 16px;">Your One-Time Password (OTP) for verification is below:</p>
          <div class="otp">${otp}</div>
          <p class="footer">
            If you did not request this OTP, please ignore this email.<br />
            For any issues, contact support.
          </p>
        </div>
      </body>
    </html>
  `,
  attachments: [
    {
      filename: 'Logo.jpg',
      path: '../Logo.jpg',
      cid: 'logo',
    },
  ],
});

    res.status(201).json({ message: 'Signup successful. Please verify OTP sent to your email.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong.' });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.isVerified) return res.status(400).json({ message: 'Already verified' });

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({ message: 'OTP verified successfully. You can now log in.' });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found. Please signup.' });
    }
if (!user.isVerified) {
      return res.status(401).json({ message: 'Please verify your account via OTP.' });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }
    const token = jwt.sign({ id: user._id,isAdmin: user.isAdmin}, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.cookie('token', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'None',
  maxAge: 7 * 24 * 60 * 60 * 1000,
})
  .status(200)
  .json({
    user,
    message: 'Logged in successfully',
  });

console.log("Sent token cookie to frontend");

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Something went wrong.' });
  }
};

const resetpassword=async (req,res)=>{
  try{
  const {email,password,newpassword}=req.body;
  const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found. Please signup.' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }
    const isSamePassword = await bcrypt.compare(newpassword, user.passwordHash);
    if (isSamePassword) {
      return res.status(400).json({ message: 'New password cannot be the same as the current password.' });
    }
    const hashedPassword = await bcrypt.hash(newpassword, 12);
    await User.findByIdAndUpdate(user._id, { $set: { passwordHash:hashedPassword}}, {new:true})
    return res.status(200).json({
      success:true,
      message:'Password changed successfully'
    })
  }
  catch(error){
return res.status(400).json({
  success:false,
  message:error.message,
})
  }
}
const logout=async(req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = { signup, login,resetpassword,verifyOtp,logout };
