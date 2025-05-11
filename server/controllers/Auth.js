const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
dotenv.config();

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists. Please login.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      username,
      email,
      passwordHash: hashedPassword,
      isAdmin:false 
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ user: { id: newUser._id, username: newUser.username, email: newUser.email }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong.' });
  }
};

const login = async (req, res) => {
      console.log("in api2",req.body)

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found. Please signup.' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: user._id,isAdmin: user.isAdmin}, process.env.JWT_SECRET, { expiresIn: '7d' });

    res
      .cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        user, 
        message: 'Logged in successfully'
      });
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

module.exports = { signup, login,resetpassword,logout };
