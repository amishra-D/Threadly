const mongoose=require('mongoose')
const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  boardId: { type: mongoose.Schema.Types.ObjectId, ref: "Board", required: true },
  type: { type: String, enum: ["text", "image", "video"] },
  caption: { type: String },
  content: { type: String },
  mediaUrl: { type: String },
  flair: { type: String, enum: ["Serious", "Funny", "Politics", "Philosophy", "Question", "Meme", "Beginner", "Advanced", "Support", "Challenge"], default: "Serious" },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  commentsCount: { type: Number, default: 0 },
  reportsCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});
module.exports=mongoose.model('Post', postSchema);
