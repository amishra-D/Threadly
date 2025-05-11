const mongoose=require('mongoose');
const userSchema = new mongoose.Schema({
  pfp:{type:String},
  username: { type: String, required: true, unique: true },
  bio: { type: String},
  location:{type:String},
  banner:{type:String},
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  isAdmin: { type: Boolean, default: false },
  otp: { type: String },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports=mongoose.model('User', userSchema);
