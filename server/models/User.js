const mongoose=require('mongoose');
const userSchema = new mongoose.Schema({
  pfp:{type:String,default:"https://res.cloudinary.com/dgvmc3ezr/image/upload/v1746449179/Logo_igihne.png"},
  username: { type: String, required: true, unique: true },
  bio: { type: String},
  location:{type:String},
  banner:{type:String},
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  isAdmin: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
otp:{type:String},
  createdAt: { type: Date, default: Date.now }
});

module.exports=mongoose.model('User', userSchema);
