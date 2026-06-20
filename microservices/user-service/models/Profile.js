const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  authId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true }, // Links back to Auth Service ID
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  pfp: { type: String, default: "https://res.cloudinary.com/dgvmc3ezr/image/upload/v1746449179/Logo_igihne.png" },
  bio: { type: String },
  location: { type: String },
  banner: { type: String },
  bookmarks: [{ type: String }], // Store Post IDs as strings or ObjectId if keeping strictly typed
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Profile', profileSchema);
