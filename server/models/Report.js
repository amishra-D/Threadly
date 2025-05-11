const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ["Post", "Comment"],
    required: true 
  },
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'type'
  },
  reportedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  reason: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema);
