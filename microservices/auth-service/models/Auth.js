const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: function() { return this.provider === 'local'; } },
  provider: { type: String, enum: ['local', 'google'], default: 'local' },
  googleId: { type: String, unique: true, sparse: true },
  isAdmin: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpiry: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Auth', authSchema);
