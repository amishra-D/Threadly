const mongoose = require('mongoose');
const reportSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Post", "Comment"],
    required: true
  },
  contentId: {
    type: String,
    required: true
  },
  reportedBy: {
    type: String,
    required: true
  },
  reason: { type: String },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Report', reportSchema);