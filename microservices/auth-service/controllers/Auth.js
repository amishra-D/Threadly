const dotenv = require('dotenv');
dotenv.config(); // Must be first before any process.env reads

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Auth = require('../models/Auth');
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const axios = require('axios');
const { publishToQueue } = require('../rabbitmq/producer');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID);

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await Auth.findOne({ email });

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

    const newUser = new Auth({
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
      text: `Your One-Time Password (OTP) for Threadly is: ${otp}`,
    });

    res.status(201).json({ message: 'Signup successful. Please verify OTP sent to your email.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong during signup.' });
  }
}

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const authRecord = await Auth.findOne({ email });
    if (!authRecord) return res.status(404).json({ message: 'User not found' });

    if (authRecord.isVerified) return res.status(400).json({ message: 'Already verified' });

    if (authRecord.otp !== otp || authRecord.otpExpiry < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    authRecord.isVerified = true;
    authRecord.otp = null;
    authRecord.otpExpiry = null;
    await authRecord.save();

    try {
      const profileData={
        authId: authRecord._id,
        username: authRecord.username,
        email: authRecord.email
      }
      await publishToQueue('user_created', profileData);
      console.log("User profile created successfully");
    } catch (profileError) {
        console.error("Failed to create profile in User Service", profileError.message);
    }

    res.status(200).json({ message: 'OTP verified successfully. You can now log in.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong.' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const authRecord = await Auth.findOne({ email });
    if (!authRecord) {
      return res.status(400).json({ message: 'User not found. Please signup.' });
    }
    if (!authRecord.isVerified) {
      return res.status(401).json({ message: 'Please verify your account via OTP.' });
    }
    const isPasswordCorrect = await bcrypt.compare(password, authRecord.passwordHash);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }
    const token = jwt.sign({ id: authRecord._id, isAdmin: authRecord.isAdmin }, process.env.JWT_SECRET, { expiresIn: '7d' });
    const isProduction = process.env.NODE_ENV === 'production';
    
    let userProfile = { username: authRecord.username, _id: authRecord._id };
    try {
        const response = await axios.get(`${process.env.USER_SERVICE_URL}/internal/profile/${authRecord._id}`);
        if(response.data && response.data.profile) {
            userProfile = response.data.profile;
        }
    } catch(profileErr) {
        console.error("Could not fetch profile during login", profileErr.message);
    }

    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'None' : 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
      .status(200)
      .json({
        user: { ...userProfile, isAdmin: authRecord.isAdmin, email: authRecord.email },
        message: 'Logged in successfully',
      });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Something went wrong.' });
  }
};

const resetpassword = async (req, res) => {
  try {
    const { email, password, newpassword } = req.body;
    const authRecord = await Auth.findOne({ email });
    if (!authRecord) {
      return res.status(400).json({ message: 'User not found. Please signup.' });
    }
    const isPasswordCorrect = await bcrypt.compare(password, authRecord.passwordHash);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }
    const isSamePassword = await bcrypt.compare(newpassword, authRecord.passwordHash);
    if (isSamePassword) {
      return res.status(400).json({ message: 'New password cannot be the same as the current password.' });
    }
    const hashedPassword = await bcrypt.hash(newpassword, 12);
    await Auth.findByIdAndUpdate(authRecord._id, { $set: { passwordHash: hashedPassword } }, { new: true })
    return res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    })
  }
  catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    })
  }
}
const signupandloginwithgoogle = async (req, res) => {
  try {
    const { tokenId } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.OAuth_CLIENT_ID
    });

    const payload = ticket.getPayload();

    const {
      email,
      name,
      sub: googleId,
      email_verified
    } = payload;

    let authRecord = await Auth.findOne({ email });
    if (authRecord) {

      if (!authRecord.googleId) {
        authRecord.googleId = googleId;
        authRecord.provider = "google";
        authRecord.isVerified = true;
        await authRecord.save();
      }

    } else {

      authRecord = await Auth.create({
        username: name,
        email,
        provider: "google",
        googleId,
        isVerified: email_verified
      });

      try {
        const profileData = {
          authId: authRecord._id,
          username: authRecord.username,
          email: authRecord.email
        };

        await publishToQueue(
          "user_created",
          profileData
        );

      } catch (profileError) {
        console.error(
          "Failed to create profile",
          profileError.message
        );
      }
    }

    const token = jwt.sign(
      {
        id: authRecord._id,
        isAdmin: authRecord.isAdmin
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    const isProduction =
      process.env.NODE_ENV === "production";

    let userProfile = {
      username: authRecord.username,
      _id: authRecord._id
    };

    try {
      const response = await axios.get(
        `${process.env.USER_SERVICE_URL}/internal/profile/${authRecord._id}`
      );

      if (
        response.data &&
        response.data.profile
      ) {
        userProfile = response.data.profile;
      }

    } catch (profileErr) {
      console.error(
        "Could not fetch profile",
        profileErr.message
      );
    }

    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction
          ? "None"
          : "Lax",
        maxAge:
          7 * 24 * 60 * 60 * 1000
      })
      .status(200)
      .json({
        success: true,
        user: {
          ...userProfile,
          email: authRecord.email,
          isAdmin: authRecord.isAdmin
        },
        message: "Google login successful"
      });

  } catch (error) {
    console.error(
      "Google auth error:",
      error
    );

    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const logout = async (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.clearCookie('token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'None' : 'Lax',
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = { signup, login, resetpassword, verifyOtp,signupandloginwithgoogle, logout };
